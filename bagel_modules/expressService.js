let expressModule = {}
const express = require("express");
const app = express();
const questionService = require('./questionService');
let errors = require('./errors.json');
let cors = require('cors')

var corsOptions = {
    origin: 'http://localhost:3000', // web app for testing
    optionsSuccessStatus: 200
}

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

app.use(cors(corsOptions));

let server = app.listen(8080);

expressModule.run = () => {

    app.get("/", (req, res) => {
        res.sendStatus(200);
    });

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