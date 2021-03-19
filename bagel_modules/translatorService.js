const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'BagelQB',
  password: 'postgres',
  port: 5432,
})

// SERVICE TO TRANSLATE TEXT NAMES TO IDS AND VICE-VERSA.

var translatorService = {};


var tournament_id_to_data = {}
pool.query("SELECT * FROM tournaments", (err, res) => {
	tournament_id_to_data = Object.fromEntries(res.rows.map((tournament) => [tournament.id, tournament]));
})



translatorService.tournamentFromID = (id) => {
	return new Promise((resolve, reject) => {
		if(!tournament_id_to_data) resolve({status: "fail", result: {error_code: 1}});
		resolve({status: "ok", result: tournament_id_to_data[id]});
	});
}

translatorService.getTournamentsWithDifficulty = (difficulty) => {
	return new Promise((resolve, reject) => {
		pool.query("SELECT * FROM tournaments WHERE difficulty = " + difficulty, (err, res) => {
			if(res) {
				if(res.rows && res.rows[0]) {
					resolve({status: "ok", result: res.rows.map(tourney => tourney.id)});
				} else {
					resolve({status: "fail", result: {error_code: 1}});
				}
				
			} else {
				resolve({status: "fail", result: {error_code: 1}});
			}
			
		})
	});
}

translatorService.getTournamentsWithDifficultyList = (difficulty_list) => {
	return new Promise((resolve, reject) => {

		var difficulty_query = difficulty_list.join(" OR difficulty = ");

		pool.query("SELECT * FROM tournaments WHERE difficulty = " + difficulty_query, (err, res) => {
			if(res) {
				if(res.rows && res.rows[0]) {
					resolve({status: "ok", result: res.rows.map(tourney => tourney.id)});
				} else {
					resolve({status: "fail", result: {error_code: 1}});
				}
				
			} else {
				resolve({status: "fail", result: {error_code: 1}});
			}
			
		})
	});
}






module.exports = translatorService;