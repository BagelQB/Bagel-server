// Completes tossup and bonus entries in postgres.
require('colors'); // for ease of debugging
const cliProgress = require('cli-progress'); // To not slow down cli with copious console.logs

const Pool = require('pg').Pool
const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'BagelQB',
	password: 'postgres',
	port: 5432,
});

console.log("\n\n");
const bar1 = new cliProgress.SingleBar({format: formatter}, cliProgress.Presets.shades_grey);



let total_trials = 0;
let total_pass = 0;
let total_fail = 0;
let total_untested = 0;

pool.query('SELECT COUNT(*) FROM tossups', (err, res) => {
	pool.query('SELECT COUNT(*) FROM bonuses', (err, res2) => {
		test(parseInt(res.rows[0].count) + parseInt(res2.rows[0].count))
	})
})

/**
 * Function to format progress bars (DRY alert)
 * @param {Object} options - cli-progress bar options.
 * @param {Object} params - cli-progress bar values.
 * @param {Object} payload - cli-progress user set values.
 * @returns {String} - format string for the progress bar.
 */
function formatter(options, params, payload){
	const bar =  "[" + options.barCompleteString.substr(0, Math.round(params.progress*options.barsize) - 1).green.dim + (options.barsize - Math.round(params.progress*options.barsize) === 0 ? "" : options.barCompleteString.substr(0,1).green.bold) + options.barIncompleteString.substr(0, options.barsize-Math.round(params.progress*options.barsize)) + "]";
	if (params.value >= params.total){
		return '    # ' + payload.type.green + '   ' + (params.value + '/' + params.total) + "  " + bar;
	}else{
		return '    # ' + payload.type.grey + '   ' + (params.value + '/' + params.total) + "  " + bar;
	}
}

/**
 * Function to test database values
 * @param {int} max - The amount of entries that will be tested
 */
function test(max) {
	bar1.start(max, 0, {type: "Test"});
	pool.query('SELECT * FROM tossups', (err, res) => {
		res.rows.forEach((row, i) => {


			var test_untest = (!row.category_id && !row.subcategory_id && (!row.text || row.text.toLowerCase() === "[missing]"));
			var trial_res = (row.difficulty && row.subcategory_id);

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

			bar1.increment();
			if(bar1.value >= max) {
				bar1.stop();
				process.exit(0);
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
				//console.log(`[Bonuses]`.bold + " ? NOT TESTED".magenta.bold);
			} else {
				total_trials += 1;
				total_pass += (trial_res ? 1 : 0);
				total_fail += (trial_res ? 0 : 1);

				//console.log(`[Bonuses]`.bold + (trial_res ? " + PASSED".green.bold : " - FAILED".red.bold));
			}

			bar1.increment();
			if(bar1.value >= max) {
				bar1.stop();
				process.exit(0);
			}
		})
	});
}







/**
 * Handler to send text to the terminal before the process ends
 */
function exitHandler(options, exitCode) {
    console.log('\n\n   DB TEST COMPLETE:'.bold + `\n   TOTAL TRIALS: ${total_trials}`.bold + `\n   PASSED: ${total_pass}`.green.bold + `\n   FAILED: ${total_fail}`.red.bold + `\n   UNTESTED: ${total_untested}`.magenta.bold);
}


process.on('exit', exitHandler);