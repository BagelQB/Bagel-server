const Pool = require('pg').Pool
const colors = require('colors'); // for ease of debugging
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'betterqb',
  password: 'postgres',
  port: 5432,
});

pool.query('ALTER TABLE tossups DROP COLUMN difficulty', (err, res) => {
	console.log(`[Tossups]`.bold + " - DROP".red.bold);
})

const query = `
ALTER TABLE bonuses
DROP COLUMN difficulty,
DROP COLUMN part1_text,
DROP COLUMN part2_text,
DROP COLUMN part3_text,
DROP COLUMN part1_answer,
DROP COLUMN part2_answer,
DROP COLUMN part3_answer
`

pool.query(query, (err, res) => {
	console.log(`[Bonuses]`.bold + " - DROP".red.bold);
})

function tenify(num) {
	if(num < 10) {
		return "0" + num;
	}
	return num.toString();
}

pool.query("SELECT id, name FROM categories", (err, res) => {
	res.rows.forEach(({id, name}) => {
		var misc_subcat_id = "1" + tenify(id);
		pool.query("DELETE FROM subcategories WHERE id = " + misc_subcat_id, (err, res) => {
			console.log(`[Subcategories]`.bold + " - Delete".red.bold);
		});

		const query = `UPDATE tossups SET subcategory_id = NULL WHERE subcategory_id = ${misc_subcat_id}`;
		pool.query(query, (err2, res2) => {
			if(res2) {
				console.log(`[Subcategories]`.bold + " <> UPDATE".yellow.bold + ` (Rows affected: ${res2.rowCount})`.grey);
			} else {
				console.log(`[Subcategories]`.bold + " ! UPDATE FAILED".red.bold + ` {${query}}`.bold);
			}

		})

	})
})