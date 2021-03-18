const Pool = require('pg').Pool
qService = {};

var translatorService = require('./translatorService');

// SERVICE TO RETRIEVE QUESTIONS


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'betterqb',
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
					resolve({status: "fail", result: {error_code: 1}});
				}
			});
		} else {
			resolve({status: "fail", result: {error_code: 2}});
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
					resolve({status: "fail", result: {error_code: 1}});
				}
			});
		} else {
			resolve({status: "fail", result: {error_code: 2}});
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
					resolve({status: "fail", result: {error_code: 1}});
				}
			});
		} else {
			resolve({status: "fail", result: {error_code: 2}});
		}
	});
}

qService.getTossupsByParameters = (difficulty_list, subcat_id_list, limit) => {
	return new Promise((resolve, reject) => {

		if(Array.isArray(difficulty_list) && Array.isArray(subcat_id_list) && Number.isInteger(limit)) {

			var category_query = subcat_id_list.join(" OR subcategory_id = ");
			translatorService.getTournamentsWithDifficultyList(difficulty_list).then(({status, result}) => {
				if(status === "ok") {
					var tournament_query = result.join(" OR tournament_id = ");
					pool.query("SELECT * FROM tossups WHERE (subcategory_id = " + category_query + ") AND (tournament_id = " + tournament_query + ") ORDER BY RANDOM() LIMIT " + limit, (err, res) => {
						if(res && res.rows && res.rows[0]) {
							resolve({status: "ok", result: res.rows});
						} else {
							resolve({status: "fail", result: {error_code: 1}});
						}

					});
				} else {
					resolve({status: "fail", result: {error_code: 1}});
				}
			}).catch((err) => {
				resolve({status: "fail", result: {error_code: 1}});
			})
		} else {
			resolve({status: "fail", result: {error_code: 2}});
		}
	});
}

qService.getBonusByID = (id) => {
	return new Promise((resolve, reject) => {
		if(Number.isInteger(id)) {
			pool.query("SELECT * FROM bonuses WHERE id = " + id.toString() + " LIMIT 1", (err, res) => {

				if(res.rows[0]) {

					var bonus = res.rows[0];

					pool.query("SELECT * FROM bonus_parts WHERE bonus_id = " + id.toString() + " LIMIT 3", (err, res) => {
						var parts = {}
						if(res && res.rows.length === 3) {
							res.rows.forEach((part) => {parts[part.number] = part});
							bonus["parts"] = parts;
							resolve({status: "ok", result: bonus});
						} else {
							resolve({status: "fail", result: {error_code: 1}});
						}
					})

					
				} else {
					resolve({status: "fail", result: {error_code: 1}});
				}
			});
		} else {
			resolve({status: "fail", result: {error_code: 2}});
		}
	});
}

qService.getBonusesByParameters = (difficulty_list, subcat_id_list, limit) => {
	return new Promise((resolve, reject) => {

		if(Array.isArray(difficulty_list) && Array.isArray(subcat_id_list) && Number.isInteger(limit)) {

			var category_query = subcat_id_list.join(" OR subcategory_id = ");
			translatorService.getTournamentsWithDifficultyList(difficulty_list).then(({status, result}) => {
				if(status === "ok") {
					var tournament_query = result.join(" OR tournament_id = ");
					pool.query("SELECT * FROM bonuses WHERE (subcategory_id = " + category_query + ") AND (tournament_id = " + tournament_query + ") ORDER BY RANDOM() LIMIT " + limit, (err, res) => {
						if(res && res.rows && res.rows[0]) {
							resolve({status: "ok", result: res.rows});
						} else {
							resolve({status: "fail", result: {error_code: 1}});
						}

					});
				} else {
					resolve({status: "fail", result: {error_code: 1}});
				}
			}).catch((err) => {
				resolve({status: "fail", result: {error_code: 1}});
			})
		} else {
			resolve({status: "fail", result: {error_code: 2}});
		}
	});
}

qService.getPartsForBonus = (bonus_id) => {
	return new Promise((resolve, reject) => {
		if(Number.isInteger(bonus_id)) {
			pool.query("SELECT * FROM bonus_parts WHERE bonus_id = " + bonus_id.toString() + " LIMIT 3", (err, res) => {
				var parts = {}
				if(res && res.rows.length === 3) {
					res.rows.forEach((part) => {parts[part.number] = part});
					resolve({status: "ok", result: parts});
				} else {
					resolve({status: "fail", result: {error_code: 1}});
				}
			})
		} else {
			resolve({status: "fail", result: {error_code: 2}});
		}
	});
}



module.exports = qService;