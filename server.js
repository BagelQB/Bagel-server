// Running this will load in all of the modules and start the server. New modules should not be written directly here, instead, they should be require()'d.
// Before your PR is accepted, you must write and pass your tests. (npm run test)
// Server should be started with "npm run start".

const express = require("express");

const app = express();

const questionService = require('./bagel_modules/questionService');

app.listen(8080, () => {
    console.log(`Server is running on port 8080.`);
});

app.get("/", (req, res) => {
    res.sendStatus(200);
});

app.get("/api/bonuses/", (req, res) => {
    switch (req.query.type) {
        case 'id':
            questionService.getBonusByID(+req.query.id).then(({status, result}) => {
                if (status === 'ok') {
                    res.json({
                        message: 'success',
                        data: result
                    });
                } else if (status === 'fail') {
                    res.json({
                        message: 'error',
                        error: result.error_code
                    });
                }
            });
    }
});

app.get("/api/tossups/", (req, res) => {
    switch (req.query.type) {
        case 'id':
            questionService.getTossupByID(+req.query.id).then(({status, result}) => {
                if (status === 'ok') {
                    res.json({
                        message: 'success',
                        data: result
                    });
                } else if (status === 'fail') {
                    res.json({
                        message: 'error',
                        error: result.error_code
                    });
                }
            });
    }
});