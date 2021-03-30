// Completes tossup and bonus entries in postgres.
require('colors'); // for ease of debugging
const cliProgress = require('cli-progress'); // To not slow down cli with copious console.logs

const nano = require('nano')('http://admin:admin@localhost:5984'); // Insert your own couchdb credentials here.
const db = nano.use('bagel-qb');

console.log(`\n\n[DbEntryTest]`.bold + " Now testing db entries.\n" + "(This may take a while to start as couchdb queries all tossups and bonuses)\n\n".gray.dim);

db.list({include_docs: true}).then((doclist) => {

	const totalDocs = doclist.rows.length;

	const bar1 = new cliProgress.SingleBar({format: `    Test [` + "{bar}".green.bold + `] {percentage}% | ETA: {eta}s | {value}/{total}`}, cliProgress.Presets.shades_classic);

	bar1.start(totalDocs, 0);



	doclist.rows.forEach((doc) => {
		if(doc.id.startsWith("tossups")) {
			var test_untest = (!doc.doc.category_id && !doc.doc.subcategory_id && (!doc.doc.text || doc.doc.text.toLowerCase() === "[missing]"));
			var trial_res = (doc.doc.difficulty && doc.doc.subcategory_id);

			if(test_untest) {
				total_untested += 1;
				total_trials += 1;
				//console.log(`[Tossups]`.bold + " ? NOT TESTED".magenta.bold);
			} else {
				total_trials += 1;
				total_pass += (trial_res ? 1 : 0);
				total_fail += (trial_res ? 0 : 1);

				//console.log(`[Tossups]`.bold + (trial_res ? " + PASSED".green.bold : " - FAILED".red.bold));
			}


		} else {
			var test_untest = (!doc.doc.category_id && !doc.doc.subcategory_id)
			var trial_res = (doc.doc.difficulty && doc.doc.subcategory_id && doc.doc.part1_text && doc.doc.part1_answer && doc.doc.part2_text && doc.doc.part2_answer && doc.doc.part3_text && doc.doc.part3_answer)

			if(test_untest) {
				total_untested += 1;
				total_trials += 1;
				//console.log(`[Bonuses]`.bold + " ? NOT TESTED".magenta.bold);
			} else {
				total_trials += 1;
				total_pass += (trial_res ? 1 : 0);
				total_fail += (trial_res ? 0 : 1);

				//console.log(`[Bonuses]`.bold + (trial_res ? " + PASSED".green.bold : " - FAILED".red.bold));
			}
		}

		bar1.update(total_trials);
		if(total_trials >= totalDocs) {
			bar1.stop();
		}

	});
});


var total_trials = 0;
var total_pass = 0;
var total_fail = 0;
var total_untested = 0;

function exitHandler(options, exitCode) {
    if (options.cleanup) console.log('\n\n   DB TEST COMPLETE:'.bold + `\n   TOTAL TRIALS: ${total_trials}`.bold + `\n   PASSED: ${total_pass}`.green.bold + `\n   FAILED: ${total_fail}`.red.bold + `\n   UNTESTED: ${total_untested}`.magenta.bold);
    if (options.exit) process.exit();
}


//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

/*

pool.query('SELECT * FROM tossups', (err, res) => {
	res.rows.forEach((row, i) => {





	})
});

pool.query('SELECT * FROM bonuses', (err, res) => {
	res.rows.forEach((row, i) => {


	})
});


*/