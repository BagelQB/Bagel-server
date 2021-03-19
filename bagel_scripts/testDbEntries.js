// Completes tossup and bonus entries in postgres.
const colors = require('colors'); // for ease of debugging

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'BagelQB',
  password: 'postgres',
  port: 5432,
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


pool.query('SELECT * FROM tossups', (err, res) => {
	res.rows.forEach((row, i) => {
		var test_untest = (!row.category_id && !row.subcategory_id && (!row.text || row.text.toLowerCase() === "[missing]"))
		var trial_res = (row.difficulty && row.subcategory_id)


		if(test_untest) {
			total_untested += 1;
			total_trials += 1;
			console.log(`[Tossups - ${i+1}/${res.rowCount}]`.bold + " ? NOT TESTED".magenta.bold);
		} else {
			total_trials += 1;
			total_pass += (trial_res ? 1 : 0);
			total_fail += (trial_res ? 0 : 1);

			console.log(`[Tossups - ${i+1}/${res.rowCount}]`.bold + (trial_res ? " + PASSED".green.bold : " - FAILED".red.bold));
		}

	})
});

pool.query('SELECT * FROM bonuses', (err, res) => {
	res.rows.forEach((row, i) => {

		var test_untest = (!row.category_id && !row.subcategory_id)
		var trial_res = (row.difficulty && row.subcategory_id && row.part1_text && row.part1_answer && row.part2_text && row.part2_answer && row.part3_text && row.part3_answer)

		if(test_untest) {
			total_untested += 1;
			total_trials += 1;
			console.log(`[Bonuses - ${i+1}/${res.rowCount}]`.bold + " ? NOT TESTED".magenta.bold);
		} else {
			total_trials += 1;
			total_pass += (trial_res ? 1 : 0);
			total_fail += (trial_res ? 0 : 1);

			console.log(`[Bonuses - ${i+1}/${res.rowCount}]`.bold + (trial_res ? " + PASSED".green.bold : " - FAILED".red.bold));
		}
	})
});


