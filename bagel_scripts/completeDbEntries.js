// Completes tossup and bonus entries in postgres.
const colors = require('colors'); // for ease of debugging

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'betterqb',
  password: 'postgres',
  port: 5432,
});

var total_trials = 0;
var rows_affected = 0;

function exitHandler(options, exitCode) {
    if (options.cleanup) console.log('\n\n   DB COMPLETION COMPLETE:'.bold + `\n   ENTRIES SEARCHED: ${total_trials}`.bold + `\n   ROWS UPDATED: ${rows_affected}`.yellow.bold);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

pool.query('ALTER TABLE tossups ADD COLUMN IF NOT EXISTS difficulty integer', (err, res) => {
	pool.query("SELECT id, difficulty FROM tournaments", (err, res) => {
		res.rows.forEach(({id, difficulty}, i) => {
			total_trials += 1;
			const query = `UPDATE tossups SET difficulty = ${difficulty} WHERE tournament_id = ${id}`;
			pool.query(query, (err2, res2) => {
				if(res2) {
					rows_affected += res2.rowCount;
					console.log(`[Tossups - ${i+1}/${res.rowCount}]`.bold + " <> UPDATE".yellow.bold + ` (Rows affected: ${res2.rowCount})`.grey);
				} else {
					console.log(`[Tossups - ${i+1}/${res.rowCount}]`.bold + " ! UPDATE FAILED".red.bold + ` {${query}}`.bold);
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
		res.rows.forEach(({id, difficulty}, i) => {
			total_trials += 1;
			const query = `UPDATE bonuses SET difficulty = ${difficulty} WHERE tournament_id = ${id}`;
			pool.query(query, (err2, res2) => {
				if(res2) {
					rows_affected += res2.rowCount;
					console.log(`[Bonuses - ${i+1}/${res.rowCount}]`.bold + " <> UPDATE".yellow.bold + ` (Rows affected: ${res2.rowCount})`.grey);
				} else {
					console.log(`[Bonuses - ${i+1}/${res.rowCount}]`.bold + " ! UPDATE FAILED".red.bold + ` {${query}}`.bold);
				}

			})
		})
	});

	pool.query("SELECT bonus_id, number, formatted_text, formatted_answer FROM bonus_parts", (err, res) => {
		res.rows.forEach(({bonus_id, number, formatted_text, formatted_answer}, i) => {
			total_trials += 1;
			const query = `UPDATE bonuses SET part${number}_text = '${formatted_text.replace(/'/ig, "''")}', part${number}_answer = '${formatted_answer.replace(/'/ig, "''")}' WHERE id = ${bonus_id}`;
			pool.query(query, (err2, res2) => {
				if(res2) {
					rows_affected += res2.rowCount;
					console.log(`[Bonus parts - ${i+1}/${res.rowCount}]`.bold + " <> UPDATE".yellow.bold + ` (Rows affected: ${res2.rowCount})`.grey);
				} else {
					console.log(`[Bonus parts - ${i+1}/${res.rowCount}]`.bold + " ! UPDATE FAILED".red.bold + ` {${query}}`.bold);
				}
			})
		})
	})
});


function tenify(num) {
	if(num < 10) {
		return "0" + num;
	}
	return num.toString();
}

function populate(cat_id, subcat_id) {
	total_trials += 1;
	const query = `UPDATE tossups SET subcategory_id = ${subcat_id} WHERE category_id = ${cat_id} AND subcategory_id IS NULL`;
	pool.query(query, (err2, res2) => {
		if(res2) {
			rows_affected += res2.rowCount;
			console.log(`[Subcategories-Tossups]`.bold + " <> UPDATE".yellow.bold + ` (Rows affected: ${res2.rowCount})`.grey);
		} else {
			console.log(`[Subcategories-Tossups]`.bold + " ! UPDATE FAILED".red.bold + ` {${query}}`.bold);
		}

	});


	const query2 = `UPDATE bonuses SET subcategory_id = ${subcat_id} WHERE category_id = ${cat_id} AND subcategory_id IS NULL`;
	pool.query(query2, (err2, res2) => {
		if(res2) {
			rows_affected += res2.rowCount;
			console.log(`[Subcategories-Bonuses]`.bold + " <> UPDATE".yellow.bold + ` (Rows affected: ${res2.rowCount})`.grey);
		} else {
			console.log(`[Subcategories-Bonuses]`.bold + " ! UPDATE FAILED".red.bold + ` {${query2}}`.bold);
		}

	});
}

pool.query("SELECT id, name FROM categories", (err, res) => {
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
			}
		});
	})
})


