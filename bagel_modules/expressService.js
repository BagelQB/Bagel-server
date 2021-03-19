var expressModule = {}

const express = require("express");

const app = express();

const questionService = require('./questionService');



function sendQuestions(res, status, result) {
    if (status === 'ok') {
        res.json({
            message: 'success',
            data: result
        });
    } else if (status === 'fail') {
        res.json({
            message: 'error',
            error_code: result.error_code
        });
    }
}

let server = app.listen(8080);


expressModule.run = () => {


    app.get("/", (req, res) => {
        res.sendStatus(200);
    });

    app.get("/api/tossups/", (req, res) => {
        switch (req.query.type) {
            case 'id':
                req.query.id = +req.query.id
                if (req.query.id) {
                    questionService.getTossupByID(req.query.id).then(({status, result}) => {
                        sendQuestions(res, status, result);
                    });
                } else {
                    res.json({
                        message: 'error',
                        error_code: '1000',
                        error: 'Request must include id'
                    });
                }
                break;
            case 'cat':
                req.query.cat = +req.query.cat;
                req.query.limit = +req.query.limit;
                if (req.query.cat && req.query.limit) {
                    questionService.getTossupsByCategoryID(req.query.cat, req.query.limit).then(({status, result}) => {
                        sendQuestions(res, status, result);
                    });
                } else if (!req.query.cat) {
                    res.json({
                        message: 'error',
                        error_code: 1001,
                        error: 'Request must include category'
                    });
                } else if (!req.query.limit) {
                    res.json({
                        message: 'error',
                        error_code: 1002,
                        error: 'Request must include limit'
                    });
                }
                break;
            case 'subcat':
                req.query.subcat = +req.query.subcat;
                req.query.limit = +req.query.limit;
                if (req.query.subcat && req.query.limit) {
                    questionService.getTossupsBySubcatID(req.query.subcat, req.query.limit).then(({status, result}) => {
                        sendQuestions(res, status, result);
                    });
                } else if (!req.query.subcat) {
                    res.json({
                        message: 'error',
                        error_code: 1003,
                        error: 'Request must include category'
                    });
                } else if (!req.query.limit) {
                    res.json({
                        message: 'error',
                        error_code: 1002,
                        error: 'Request must include limit'
                    });
                }
                break;
            case 'param':
                req.query.diffis = JSON.parse(req.query.diffis);
                req.query.subcats = JSON.parse(req.query.subcats);
                req.query.limit = +req.query.limit
                if (req.query.diffis && req.query.subcats && req.query.limit) {
                    questionService.getTossupsByParameters(req.query.diffis, req.query.subcats, req.query.limit)
                        .then(({status, result}) => {
                            sendQuestions(res, status, result);
                        });
                } else if (!req.query.diffis) {
                    res.json({
                        message: 'error',
                        error_code: 1004,
                        error: 'Request must include difficulty list'
                    });
                } else if (!req.query.subcats) {
                    res.json({
                        message: 'error',
                        error_code: 1005,
                        error: 'Request must include subcategory list'
                    });
                } else if (!req.query.limit) {
                    res.json({
                        message: 'error',
                        error_code: 1002,
                        error: 'Request must include limit'
                    });
                }

        }
    });

    app.get("/api/bonuses/", (req, res) => {
        switch (req.query.type) {
            case 'id':
                req.query.id = +req.query.id
                if (req.query.id) {
                    questionService.getBonusByID(req.query.id).then(({status, result}) => {
                        sendQuestions(res, status, result);
                    });
                } else {
                    res.json({
                        message: 'error',
                        error_code: '1000',
                        error: 'Request must include id'
                    });
                }
                break;
            case 'param':
                req.query.diffis = JSON.parse(req.query.diffis);
                req.query.subcats = JSON.parse(req.query.subcats);
                req.query.limit = +req.query.limit
                if (req.query.diffis && req.query.subcats && req.query.limit) {
                    questionService.getBonusesByParameters(req.query.diffis, req.query.subcats, req.query.limit)
                        .then(({status, result}) => {
                            sendQuestions(res, status, result);
                        });
                } else if (!req.query.diffis) {
                    res.json({
                        message: 'error',
                        error_code: 1004,
                        error: 'Request must include difficulty list'
                    });
                } else if (!req.query.subcats) {
                    res.json({
                        message: 'error',
                        error_code: 1005,
                        error: 'Request must include subcategory list'
                    });
                } else if (!req.query.limit) {
                    res.json({
                        message: 'error',
                        error_code: 1002,
                        error: 'Request must include limit'
                    });
                }
        }
    });
}

expressModule.server = server;
expressModule.app = app;



module.exports = expressModule;