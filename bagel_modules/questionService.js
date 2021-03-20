const Pool = require('pg').Pool
qService = {};


const errors = require('./errors.json');

// SERVICE TO RETRIEVE QUESTIONS


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'BagelQB',
  password: 'postgres',
  port: 5432,
})

qService.getTossupByID = (id) => {
	return new Promise((resolve, reject) => {
		if(Number.isInteger(id)) {
			pool.query("SELECT * FROM tossups WHERE id = " + id.toString() + " LIMIT 1", (err, res) => {
				if(res.rows[0]) {
					resolve({status: "ok", result: res.rows[0]});
				} else {
					resolve({status: "fail", result: errors["1"]});
				}
			});
		} else {
			resolve({status: "fail", result: errors["2"]});
		}
	});
}

qService.getTossupsBySubcatID = (subcat_id, limit) => {
	return new Promise((resolve, reject) => {
		if(Number.isInteger(subcat_id) && Number.isInteger(limit)) {
			pool.query("SELECT * FROM tossups WHERE subcategory_id = " + subcat_id.toString() + " ORDER BY RANDOM() LIMIT " + limit, (err, res) => {
				if(res.rows[0]) {
					resolve({status: "ok", result: res.rows});
				} else {
					resolve({status: "fail", result: errors["1"]});
				}
			});
		} else {
			resolve({status: "fail", result: errors["2"]});
		}
	});
}

qService.getTossupsByCategoryID = (cat_id, limit) => {
	return new Promise((resolve, reject) => {
		if(Number.isInteger(cat_id) && Number.isInteger(limit)) {
			pool.query("SELECT * FROM tossups WHERE category_id = " + cat_id.toString() + " ORDER BY RANDOM() LIMIT " + limit, (err, res) => {
				if(res.rows[0]) {
					resolve({status: "ok", result: res.rows});
				} else {
					resolve({status: "fail", result: errors["1"]});
				}
			});
		} else {
			resolve({status: "fail", result: errors["2"]});
		}
	});
}

qService.getTossupsByParameters = (difficulty_list, subcat_id_list, limit) => {
	return new Promise((resolve, reject) => {

		if(Array.isArray(difficulty_list) && Array.isArray(subcat_id_list) && Number.isInteger(limit)) {

			var category_query = subcat_id_list.join(" OR subcategory_id = ");
			var difficulty_query = subcat_id_list.join(" OR difficulty = ");

			pool.query("SELECT * FROM tossups WHERE (subcategory_id = " + category_query + ") AND (difficulty = " + difficulty_query + ") ORDER BY RANDOM() LIMIT " + limit, (err, res) => {
				if(res && res.rows && res.rows[0]) {
					resolve({status: "ok", result: res.rows});
				} else {
					resolve({status: "fail", result: errors["1"]});
				}

			});

		} else {
			resolve({status: "fail", result: errors["2"]});
		}
	});
}

qService.getBonusByID = (id) => {
	return new Promise((resolve, reject) => {
		if(Number.isInteger(id)) {
			pool.query("SELECT * FROM bonuses WHERE id = " + id.toString() + " LIMIT 1", (err, res) => {

				if(res.rows[0]) {

					var bonus = res.rows[0];

					resolve({status: "ok", result: bonus});

					
				} else {
					resolve({status: "fail", result: errors["1"]});
				}
			});
		} else {
			resolve({status: "fail", result: errors["2"]});
		}
	});
}

qService.getBonusesByParameters = (difficulty_list, subcat_id_list, limit) => {
	return new Promise((resolve, reject) => {

		if(Array.isArray(difficulty_list) && Array.isArray(subcat_id_list) && Number.isInteger(limit)) {

			var category_query = subcat_id_list.join(" OR subcategory_id = ");
			var difficulty_query = subcat_id_list.join(" OR difficulty = ");

			pool.query("SELECT * FROM bonuses WHERE (subcategory_id = " + category_query + ") AND (difficulty = " + difficulty_query + ") ORDER BY RANDOM() LIMIT " + limit, (err, res) => {
				if(res && res.rows && res.rows[0]) {
					resolve({status: "ok", result: res.rows});
				} else {
					resolve({status: "fail", result: errors["1"]});
				}

			});

		} else {
			resolve({status: "fail", result: errors["2"]});
		}
	});
}




module.exports = qService;