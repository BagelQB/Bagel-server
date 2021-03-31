// This script should not be run directly! Instead run `npm run complete`.

const nano = require('nano')('http://admin:admin@localhost:5984'); // Insert your own couchdb credentials here.
const db = nano.use('bagel-qb');

const {Client} = require('pg');
const QueryStream = require('pg-query-stream');
const JSONStream = require('JSONStream');
const Cursor = require('pg-cursor')

require("colors");
const cliProgress = require('cli-progress'); // To not slow down cli with copious console.logs

var memwatch = require('@floffah/node-memwatch');


const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'BagelQB',
    password: 'postgres',
    port: 5432,
});

nano.db.destroy("bagel-qb", () => { // We completely remake the database to populate it with the proper data.
    console.log(`[Sync]`.bold + " !! DROP ".red.bold + "bagel-qb".yellow.bold);
    nano.db.create("bagel-qb", {partitioned: true}, () => {
        console.log(`[Sync]`.bold + " + CREATE ".blue.bold  + "bagel-qb   ".yellow.bold + "(Partitioned)".gray.underline);

        client.connect();


        client.query("SELECT * FROM tossups", (err, res) => {
            client.query("SELECT * FROM bonuses", (err1, res1) => {
                console.log("[Sync] The synchronization process takes a large amount of time to start due to the slow spin up of couchdb. The process is not frozen.\n\n".bold);
                insert(res.rows.length, res1.rows.length);
            })
        })
    })
})


const multibar = new cliProgress.MultiBar({
    clearOnComplete: false,
    hideCursor: true,
    format: `    {type} [` + "{bar}".green.bold + `] {percentage}% | ETA: {eta}s | {value}/{total} | Last Update: {lastupdate}`
}, cliProgress.Presets.shades_grey);



const mem = multibar.create(0, 0);
mem.start(0, 0, {type: "Memory", lastupdate: Date.now()});

memwatch.on('stats', function(stats) {
    mem.total = stats.total_available_size;
    mem.update(stats.total_heap_size, {});
});

function insert(totalTu, totalB) {
    mem.stop();
    mem.start(1, 0, {type: "Memory", lastupdate: Date.now()});

    memwatch.on('stats', function(stats) {
        mem.total = stats.total_available_size;
        mem.update(stats.total_heap_size, {lastupdate: Date.now()});
    });

    const b1 = multibar.create(totalTu, 0);
    const b2 = multibar.create(totalB, 0);


    b1.start(totalTu, 0, {type: "Tossups", lastupdate: "[Omitted]"});
    b2.start(totalB, 0, {type: "Bonuses", lastupdate: "[Omitted]"});



    const query = new QueryStream('SELECT * FROM tossups')
    const stream = client.query(query)
    //release the client when the stream is finished
    stream.on("data", (chunk) => {
        chunk._id = 'tossups:' + chunk.id;
        db.insert(chunk, () => {


            b1.increment();

            if(b1.value >= b1.total && b2.value >= b2.total) {
                b1.update(b1.total);
                b2.update(b2.total);
                process.exit(0);
            }
        });
    });

    const query2 = new QueryStream('SELECT * FROM bonuses')
    const stream2 = client.query(query2)
    //release the client when the stream is finished
    stream2.on("data", (chunk) => {
        chunk._id = 'bonuses:' + chunk.id;
        db.insert(chunk, () => {
            b2.increment();
            if(b1.value >= b1.total && b2.value >= b2.total) {
                b1.update(b1.total);
                b2.update(b2.total);
                process.exit(0);
            }
        });
    });

}


