// This script should not be run directly! Instead run `npm run complete`.

const nano = require('nano')('http://admin:admin@localhost:5984'); // Insert your own couchdb credentials here.
const db = nano.use('bagel-qb');

const {Client} = require('pg');
require("colors");
const cliProgress = require('cli-progress'); // To not slow down cli with copious console.logs

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'BagelQB',
    password: 'postgres',
    port: 5432,
});

nano.db.destroy("bagel-qb", () => { // We completely remake the database to populate it with the proper data.
    console.log(`[Sync]`.bold + " !! DROP ".red.bold + "bagel-qb".yellow.bold);
    nano.db.create("bagel-qb", () => {
        console.log(`[Sync]`.bold + " + CREATE ".blue.bold  + "bagel-qb".yellow.bold);

        client.connect();


        client.query("SELECT * FROM tossups", (err, res) => {
            client.query("SELECT * FROM bonuses", (err1, res1) => {
                console.log("[Sync] The synchronization process takes a large amount of time to start due to the slow spin up of couchdb. The process is not frozen.\n\n".bold);
                insert(res.rows.length, res1.rows.length);
            })
        })
    })
})



function insert(totalTu, totalB) {

    const multibar = new cliProgress.MultiBar({
        clearOnComplete: false,
        hideCursor: true

    }, cliProgress.Presets.shades_grey);



    const b1 = multibar.create(totalTu, 0);
    const b2 = multibar.create(totalB, 0);



    b1.start(totalTu, 0);
    b2.start(totalB, 0);



    const query2 = "SELECT * FROM tossups";
    client.query(query2, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        res.rows.forEach(question => {


            question._id = 'tossups:' + question.id;
            db.insert(question).then(() => {
                b1.increment();
                if(b1.value >= b1.total && b2.value >= b2.total) {
                    b1.update(b1.total);
                    b2.update(b2.total);
                    process.exit(0);
                }
            })
        });
    });

    const query = "SELECT * FROM bonuses";

    client.query(query, (err, res) => {

        if (err) {
            console.error(err);
            return;
        }
        res.rows.forEach(question => {

            question._id = 'bonuses:' + question.id;
            db.insert(question).then(() => {
                b2.increment();
                if(b1.value >= b1.total && b2.value >= b2.total) {
                    b1.update(b1.total);
                    b2.update(b2.total);
                    process.exit(0);
                }
            })
        });
    });

}


