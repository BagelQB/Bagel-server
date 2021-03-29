let expressModule = {}
const express = require("express");
const app = express();
const questionService = require('./questionService');
let admin = require("firebase-admin");
const dataService = require("./dataService");
let errors = require('./errors.json');

function sendQuestions(res, status, result) {
    if (status === 'ok') {
        res.status(200).json({
            message: 'success',
            data: result
        });
    } else if (status === 'fail') {
        sendError(result.error_code, res);
    }
}

function sendError(code, res) {
    res.status(400).json({
        message: 'error',
        error: errors[code]
    });
}


function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

let newUser = (token) => {
    return {name: token.name, email: token.email, email_verified: token.email_verified};
}


let server = app.listen(8080);



expressModule.run = () => {

    app.get("/", (req, res) => {
        res.sendStatus(200);
    });

    app.get("/api/users/", (req, res) => {
        let uid = req.query.id;
        let token = req.query.auth;


        if(uid && token) {
            admin.auth().verifyIdToken(token).then((decodedToken) => {
                if(decodedToken.uid === uid) {
                    const database = dataService.getDB();
                    if (database && database.users && database.users[uid]) {
                        res.status(200).json({
                            message: 'success',
                            data: database.users[uid]
                        });
                    } else {
                        res.status(404).json({
                            message: 'error',
                            error: errors[1015]
                        });
                    }
                } else {
                    sendError(1014, res);
                }
            }).catch((err) => {
                console.log(err);
                sendError(1013, res);
            })
        } else {
            sendError(1012, res);
        }
    });

    app.post("/api/users/", (req, res) => {
        if(req.query.auth) {
            admin.auth().verifyIdToken(req.query.auth).then((decodedToken) => {
                const database = dataService.getDB();
                if (database && database.users && database.users[decodedToken.uid]) {
                    res.status(503).json({message: "Account already exists"})
                    // user already exists
                } else {
                    //create user

                    dataService.addEntryWithName("/users", decodedToken.uid, newUser(decodedToken)).then((result) => {
                        res.status(201).json({message: "Created account"})
                    }).catch((err) => {
                        console.log(err);
                        res.status(500).json({message: "Could not create account", error: "a"});
                    })
                }
            }).catch((err) => {
                console.log(err);
                sendError(1013, res);
            });
        } else {
            sendError(1012, res);
        }

    })

    app.get("/api/tossups/", (req, res) => {
        switch (req.query.type) {
            case 'id': //Uses getTossupByID
                if (req.query.id) {
                    if (+req.query.id) {
                        req.query.id = +req.query.id
                    } else {
                        sendError(1001, res);
                    }
                    questionService.getTossupByID(req.query.id).then(({status, result}) => {
                        sendQuestions(res, status, result);
                    });
                } else {
                    sendError(1000, res);
                }
                break;
            case 'cat': //Uses getTossupByCategoryID
                if (req.query.cat && req.query.limit) {
                    if (+req.query.cat && +req.query.cat) {
                        req.query.cat = +req.query.cat;
                        req.query.limit = +req.query.limit;
                        questionService.getTossupsByCategoryID(req.query.cat, req.query.limit)
                            .then(({status, result}) => {
                                sendQuestions(res, status, result);
                            });
                    } else if (!+req.query.cat) {
                        sendError(1003, res);
                    } else if (!+req.query.limit) {
                        sendError(1007, res);
                    }
                } else if (!req.query.cat) {
                    sendError(1002, res);
                } else if (!req.query.limit) {
                    sendError(1006, res);
                }
                break;
            case 'subcat': //Uses getTossupBySubcatID
                if (req.query.subcat && req.query.limit) {
                    if (+req.query.subcat && +req.query.limit) {
                        req.query.subcat = +req.query.subcat;
                        req.query.limit = +req.query.limit;
                        questionService.getTossupsBySubcatID(req.query.subcat, req.query.limit)
                            .then(({status, result}) => {
                                sendQuestions(res, status, result);
                            });
                    } else if (!+req.query.subcat) {
                        sendError(1005, res);
                    } else if (!+req.query.limit) {
                        sendError(1007, res);
                    }
                } else if (!req.query.subcat) {
                    sendError(1004, res);
                } else if (!req.query.limit) {
                    sendError(1006, res);
                }
                break;
            case 'param': //Uses getTossupsByParameters
                if (req.query.diffis && req.query.subcats && req.query.limit) {
                    if (isJson(req.query.diffis) && isJson(req.query.subcats) && +req.query.limit) {
                        req.query.diffis = JSON.parse(req.query.diffis);
                        req.query.subcats = JSON.parse(req.query.subcats);
                        req.query.limit = +req.query.limit
                        questionService.getTossupsByParameters(req.query.diffis, req.query.subcats, req.query.limit)
                            .then(({status, result}) => {
                                sendQuestions(res, status, result);
                            });
                    } else if (!isJson(req.query.diffis)) {
                        sendError(1009, res)
                    } else if (!isJson(req.query.subcats)) {
                        sendError(1011, res)
                    } else if (!+req.query.limit) {
                        sendError(1007, res)
                    }
                } else if (!req.query.diffis) {
                    sendError(1008, res);
                } else if (!req.query.subcats) {
                    sendError(1010, res);
                } else if (!req.query.limit) {
                    sendError(1006, res);
                }

        }
    });

    app.get("/api/bonuses/", (req, res) => {
        switch (req.query.type) {
            case 'id': //Uses getBonusByID
                if (req.query.id) {
                    if (+req.query.id) {
                        req.query.id = +req.query.id
                    } else {
                        sendError(1001, res);
                    }
                    questionService.getBonusByID(req.query.id).then(({status, result}) => {
                        sendQuestions(res, status, result);
                    });
                } else {
                    sendError(1000, res);
                }
                break;
            case 'param': //Uses getBonusessByParameters
                if (req.query.diffis && req.query.subcats && req.query.limit) {
                    if (isJson(req.query.diffis) && isJson(req.query.subcats) && +req.query.limit) {
                        req.query.diffis = JSON.parse(req.query.diffis);
                        req.query.subcats = JSON.parse(req.query.subcats);
                        req.query.limit = +req.query.limit
                        questionService.getBonusesByParameters(req.query.diffis, req.query.subcats, req.query.limit)
                            .then(({status, result}) => {
                                sendQuestions(res, status, result);
                            });
                    } else if (!isJson(req.query.diffis)) {
                        sendError(1009, res)
                    } else if (!isJson(req.query.subcats)) {
                        sendError(1011, res)
                    } else if (!+req.query.limit) {
                        sendError(1007, res)
                    }
                } else if (!req.query.diffis) {
                    sendError(1008, res);
                } else if (!req.query.subcats) {
                    sendError(1010, res);
                } else if (!req.query.limit) {
                    sendError(1006, res);
                }
        }
    });
}

expressModule.server = server;
expressModule.app = app;


module.exports = expressModule;