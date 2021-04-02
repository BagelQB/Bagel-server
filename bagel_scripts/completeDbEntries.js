// Completes tossup and bonus entries in postgres.
require('colors'); // for ease of debugging

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'BagelQB',
  password: 'postgres',
  port: 5432,
});

const cliProgress = require('cli-progress'); // To not slow down cli with copious console.logs

var total_trials = 0;
var rows_affected = 0;

/**
 * Handler to send text to the terminal before the process ends
 */
function exitHandler() {
    console.log('\n\n   DB COMPLETION COMPLETE:'.bold + `\n   ENTRIES SEARCHED: ${total_trials}`.bold + `\n   ROWS UPDATED: ${rows_affected}`.yellow.bold);
}

/**
 * Function to format progress bars
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

console.log("\n\n    [DBCompletion] If this process seems to get stuck on 100%, it may be running cleanup. If this problem persists, you can try again or run syncDbEntries.js manually.\n\n\n".bold)

const multibar = new cliProgress.MultiBar({
	clearOnComplete: false,
	hideCursor: true,
	format: formatter
}, cliProgress.Presets.shades_grey);

const interval = setInterval(() => {closeIfBarsDone()}, 250);

/**
 * Function to end the process if all progress bars are finished.
 */
function closeIfBarsDone() {
	if(multibar.bars.length < 4) return;

	let barStillGoing = false;
	for(var i = 0; i < multibar.bars.length; i++) {
		if(multibar.bars[i].value < multibar.bars[i].total) {
			barStillGoing = true;
		}
	}

	if(!barStillGoing) {
		clearInterval(interval);
		process.exit(0);
	}

}




//do something when app is closing
process.on('exit', exitHandler);

pool.query('ALTER TABLE tossups ADD COLUMN IF NOT EXISTS difficulty integer', (err, res) => {
	pool.query("SELECT id, difficulty FROM tournaments", (err, res) => {
		const b1 = multibar.create(res.rows.length, 0, {type: "Tossups"});


		res.rows.forEach(({id, difficulty}, i) => {
			total_trials += 1;
			const query = `UPDATE tossups SET difficulty = ${difficulty} WHERE tournament_id = ${id}`;
			pool.query(query, (err2, res2) => {
				if(res2) {
					rows_affected += res2.rowCount;
					//console.log(`[Tossups - ${i+1}/${res.rowCount}]`.bold + " <> UPDATE".yellow.bold + ` (Rows affected: ${res2.rowCount})`.grey);
				} else {
					//console.log(`[Tossups - ${i+1}/${res.rowCount}]`.bold + " ! UPDATE FAILED".red.bold + ` {${query}}`.bold);
				}
				b1.increment();
				if(b1.value >= b1.total) {
					b1.stop();
				}

			})
		})
	});
});

const query = `
ALTER TABLE bonuses
ADD COLUMN IF NOT EXISTS difficulty integer,
ADD COLUMN IF NOT EXISTS part1_text text,
ADD COLUMN IF NOT EXISTS part2_text text,
ADD COLUMN IF NOT EXISTS part3_text text,
ADD COLUMN IF NOT EXISTS part1_answer text,
ADD COLUMN IF NOT EXISTS part2_answer text,
ADD COLUMN IF NOT EXISTS part3_answer text
`

pool.query(query, (err, res) => {


	pool.query("SELECT id, difficulty FROM tournaments", (err, res) => {

		const b1 = multibar.create(res.rows.length, 0, {type: "Bonuses"});

		res.rows.forEach(({id, difficulty}, i) => {
			total_trials += 1;
			const query = `UPDATE bonuses SET difficulty = ${difficulty} WHERE tournament_id = ${id}`;
			pool.query(query, (err2, res2) => {
				if(res2) {
					rows_affected += res2.rowCount;
					//console.log(`[Bonuses - ${i+1}/${res.rowCount}]`.bold + " <> UPDATE".yellow.bold + ` (Rows affected: ${res2.rowCount})`.grey);
				} else {
					//console.log(`[Bonuses - ${i+1}/${res.rowCount}]`.bold + " ! UPDATE FAILED".red.bold + ` {${query}}`.bold);
				}
				b1.increment();
				if(b1.value >= b1.total) {
					b1.stop();
				}
			})
		})
	});

	pool.query("SELECT bonus_id, number, formatted_text, formatted_answer FROM bonus_parts", (err, res) => {

		const b1 = multibar.create(res.rows.length, 0, {type: "Bonus parts"});

		res.rows.forEach(({bonus_id, number, formatted_text, formatted_answer}, i) => {
			total_trials += 1;
			const query = `UPDATE bonuses SET part${number}_text = '${formatted_text.replace(/'/ig, "''")}', part${number}_answer = '${formatted_answer.replace(/'/ig, "''")}' WHERE id = ${bonus_id}`;
			pool.query(query, (err2, res2) => {
				if(res2) {
					rows_affected += res2.rowCount;
					//console.log(`[Bonus parts - ${i+1}/${res.rowCount}]`.bold + " <> UPDATE".yellow.bold + ` (Rows affected: ${res2.rowCount})`.grey);
				} else {
					//console.log(`[Bonus parts - ${i+1}/${res.rowCount}]`.bold + " ! UPDATE FAILED".red.bold + ` {${query}}`.bold);
				}
				b1.increment();
				if(b1.value >= b1.total) {
					b1.stop();
				}
			})
		})
	})
});

/**
 * Add a 0 to a number if it's below 10 and turn it into a string
 * @param {int} num - The number to "tenify"
 * @returns {String} - The formatted number string.
 */
function tenify(num) {
	if(num < 10) {
		return "0" + num;
	}
	return num.toString();
}

/**
 * Add a placeholder subcategory id to tossups and bonuses that do not have them.
 * @param {int} cat_id - The category id to search trhough
 * @param {int} subcat_id - The subcategory id to set.
 */
function populate(cat_id, subcat_id) {
	total_trials += 1;
	const query = `UPDATE tossups SET subcategory_id = ${subcat_id} WHERE category_id = ${cat_id} AND subcategory_id IS NULL`;
	pool.query(query, (err2, res2) => {
		if(res2) {
			rows_affected += res2.rowCount;
			//console.log(`[Subcategories-Tossups]`.bold + " <> UPDATE".yellow.bold + ` (Rows affected: ${res2.rowCount})`.grey);
		} else {
			//console.log(`[Subcategories-Tossups]`.bold + " ! UPDATE FAILED".red.bold + ` {${query}}`.bold);
		}

	});


	const query2 = `UPDATE bonuses SET subcategory_id = ${subcat_id} WHERE category_id = ${cat_id} AND subcategory_id IS NULL`;
	pool.query(query2, (err2, res2) => {
		if(res2) {
			rows_affected += res2.rowCount;
			//console.log(`[Subcategories-Bonuses]`.bold + " <> UPDATE".yellow.bold + ` (Rows affected: ${res2.rowCount})`.grey);
		} else {
			//console.log(`[Subcategories-Bonuses]`.bold + " ! UPDATE FAILED".red.bold + ` {${query2}}`.bold);
		}

	});
}

pool.query("SELECT id, name FROM categories", (err, res) => {

	const b1 = multibar.create(res.rows.length, 0, {type: "Subcategories"});

	res.rows.forEach(({id, name}) => {
		var misc_subcat_id = "1" + tenify(id);
		pool.query("SELECT * FROM subcategories WHERE id = " + misc_subcat_id, (err, res) => {
			if(res && res.rows) {
				if(res.rows.length === 0) {
					pool.query(`INSERT INTO subcategories(id, name, category_id, created_at, updated_at) VALUES (${misc_subcat_id}, '${name} - Misc', ${id}, NOW(), NOW())`, (err, res) => {
						populate(id, misc_subcat_id);
					});
				} else {
					populate(id, misc_subcat_id);
				}
				b1.increment();
				if(b1.value >= b1.total) {
					b1.stop();
				}
			}
		});
	})
})


