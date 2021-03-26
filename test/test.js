/*
    TESTS ARE IMPORTANT!

    Before submitting a PR make sure you have written and passed your tests so we don't royally screw up something.
    (npm test)


*/

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

const questionService = require('../bagel_modules/questionService');
const expressService = require('../bagel_modules/expressService');
const dataService = require('../bagel_modules/dataService');
const websocketService = require('../bagel_modules/websocketService');

expressService.run();
chai.use(chaiHttp);


describe('Bagel Services', function () {
    describe('questionService', function () {
        describe('#getTossupByID(id:int)', function () {
            var q1ID = 82906;
            var q2ID = 69177;
            var q3ID = 38278376824;
            var q4ID = "not_an_int";

            it('Return proper status code and tossup for id ' + q1ID, function (done) {
                questionService.getTossupByID(q1ID).then(({status, result}) => {
                    if (status && result) {
                        if (status === "ok") {
                            done();
                        } else {
                            done(`calling getTossupByID with value ${q1ID} should return with an "ok" response.`);
                        }

                    } else {
                        done(`calling getTossupByID with value ${q1ID} does not return a properly formatted response`);
                    }

                }).catch((err) => {
                    done(`calling getTossupByID with value ${q1ID} returns an error.`);
                })
            });

            it('Return proper status code and tossup for id ' + q2ID, function (done) {
                questionService.getTossupByID(q2ID).then(({status, result}) => {
                    if (status && result) {
                        if (status === "ok") {
                            done();
                        } else {
                            done(`calling getTossupByID with value ${q1ID} should return with an "ok" response.`);
                        }

                    } else {
                        done(`calling getTossupByID with value ${q1ID} does not return a properly formatted response`);
                    }

                }).catch((err) => {
                    done(`calling getTossupByID with value ${q2ID} returns an error.`);
                })
            });

            it('Error code 1 for id ' + q3ID, function (done) {
                questionService.getTossupByID(q3ID).then(({status, result}) => {
                    if (status && result) {
                        if (status === "fail" && result.error_code && result.error_code === 1) {
                            done();
                        } else {
                            done(`calling getTossupByID with value ${q3ID} should return with a "fail" response and the proper error response (1 - does not exist).`);
                        }

                    } else {
                        done(`calling getTossupByID with value ${q3ID} does not return a properly formatted response`);
                    }

                }).catch((err) => {
                    done(`calling getTossupByID with value ${q3ID} returns an error.`);
                })
            });

            it('Error code 2 for id ' + q4ID, function (done) {
                questionService.getTossupByID(q4ID).then(({status, result}) => {
                    if (status && result) {
                        if (status === "fail" && result.error_code && result.error_code === 2) {
                            done();
                        } else {
                            done(`calling getTossupByID with value ${q4ID} should return with a "fail" response and the proper error response (2 - improper parameter).`);
                        }

                    } else {
                        done(`calling getTossupByID with value ${q4ID} does not return a properly formatted response`);
                    }

                }).catch((err) => {
                    done(`calling getTossupByID with value ${q4ID} returns an error.`);
                })
            });
        });

        describe('#getTossupsBySubcatID(subcat_id:int, limit:int)', function () {
            var test1 = [25, 1]; // fa/other 1 tu
            var test2 = [1, 10]; // chinese myth 10 tu
            var test3 = [283, 100]; // error does not exist (1)
            var test4 = ["hello", "world"]; // error improper parameter (2)
            it(`Return 1 tossup from Fine Arts/Other`, function (done) {
                questionService.getTossupsBySubcatID(test1[0], test1[1]).then(({status, result}) => {

                    if (status && result) {
                        if (status === "ok") {
                            if (result.length === 1) {
                                done();
                            } else {
                                done("Returned greater or less than 1 tossup");
                            }
                        } else {
                            done(`calling getTossupByID with value ${test1} should return with an "ok" response.`);
                        }

                    } else {
                        done(`calling getTossupByID with value ${test1} does not return a properly formatted response`);
                    }
                }).catch((err) => {
                    done(`calling getTossupsBySubcatID with value ${test1} returns an error.`);
                })
            });

            it(`Return 10 tossups from Literature/European`, function (done) {
                questionService.getTossupsBySubcatID(test2[0], test2[1]).then(({status, result}) => {
                    if (status && result) {
                        if (status === "ok") {
                            if (result.length === 10) {
                                done();
                            } else {
                                done("Returned greater or less than 10 tossups");
                            }

                        } else {
                            done(`calling getTossupByID with value ${test2} should return with an "ok" response.`);
                        }

                    } else {
                        done(`calling getTossupByID with value ${test2} does not return a properly formatted response`);
                    }
                }).catch((err) => {
                    done(`calling getTossupsBySubcatID with value ${test2} returns an error.`);
                })
            });

            it(`Error code 1 for parameters ${test3}`, function (done) {
                questionService.getTossupsBySubcatID(test3[0], test3[1]).then(({status, result}) => {
                    if (status && result) {
                        if (status === "fail" && result.error_code && result.error_code === 1) {
                            done();
                        } else {
                            done(`calling getTossupsBySubcatID with value(s) ${test3} should return with a "fail" response and the proper error response (1 - does not exist).`);
                        }

                    } else {
                        done(`calling getTossupsBySubcatID with value(s) ${test3} does not return a properly formatted response`);
                    }
                }).catch((err) => {
                    done(`calling getTossupsBySubcatID with value ${test3} returns an error.`);
                })
            });

            it(`Error code 2 for parameters ${test4}`, function (done) {
                questionService.getTossupsBySubcatID(test4[0], test4[1]).then(({status, result}) => {
                    if (status && result) {
                        if (status === "fail" && result.error_code && result.error_code === 2) {
                            done();
                        } else {
                            done(`calling getTossupsBySubcatID with value(s) ${test4} should return with a "fail" response and the proper error response (2 - improper parameter).`);
                        }

                    } else {
                        done(`calling getTossupsBySubcatID with value(s) ${test4} does not return a properly formatted response`);
                    }
                }).catch((err) => {
                    done(`calling getTossupsBySubcatID with value ${test4} returns an error.`);
                })
            });
        });

        describe('#getTossupsByCategoryID(cat_id:int, limit:int)', function () {
            var test1 = [15, 1];
            var test2 = [18, 10];
            var test3 = [333333, 100]; // error does not exist (1)
            var test4 = ["hello", "world"]; // error improper parameter (2)
            it(`Return 1 tossup from category 15`, function (done) {
                questionService.getTossupsByCategoryID(test1[0], test1[1]).then(({status, result}) => {

                    if (status && result) {
                        if (status === "ok") {
                            if (result.length === 1) {
                                done();
                            } else {
                                done("Returned greater or less than 1 tossup");
                            }
                        } else {
                            done(`calling getTossupsByCategoryID with value ${test1} should return with an "ok" response.`);
                        }

                    } else {
                        done(`calling getTossupsByCategoryID with value ${test1} does not return a properly formatted response`);
                    }
                }).catch((err) => {
                    done(`calling getTossupsByCategoryID with value ${test1} returns an error.`);
                })
            });

            it(`Return 10 tossups from category 18`, function (done) {
                questionService.getTossupsByCategoryID(test2[0], test2[1]).then(({status, result}) => {
                    if (status && result) {
                        if (status === "ok") {
                            if (result.length === 10) {
                                done();
                            } else {
                                done("Returned greater or less than 10 tossups");
                            }

                        } else {
                            done(`calling getTossupsByCategoryID with value ${test2} should return with an "ok" response.`);
                        }

                    } else {
                        done(`calling getTossupsByCategoryID with value ${test2} does not return a properly formatted response`);
                    }
                }).catch((err) => {
                    done(`calling getTossupsByCategoryID with value ${test2} returns an error.`);
                })
            });

            it(`Error code 1 for parameters ${test3}`, function (done) {
                questionService.getTossupsByCategoryID(test3[0], test3[1]).then(({status, result}) => {
                    if (status && result) {
                        if (status === "fail" && result.error_code && result.error_code === 1) {
                            done();
                        } else {
                            done(`calling getTossupsByCategoryID with value(s) ${test3} should return with a "fail" response and the proper error response (1 - does not exist).`);
                        }

                    } else {
                        done(`calling getTossupsByCategoryID with value(s) ${test3} does not return a properly formatted response`);
                    }
                }).catch((err) => {
                    done(`calling getTossupsByCategoryID with value ${test3} returns an error.`);
                })
            });

            it(`Error code 2 for parameters ${test4}`, function (done) {
                questionService.getTossupsByCategoryID(test4[0], test4[1]).then(({status, result}) => {
                    if (status && result) {
                        if (status === "fail" && result.error_code && result.error_code === 2) {
                            done();
                        } else {
                            done(`calling getTossupsByCategoryID with value(s) ${test4} should return with a "fail" response and the proper error response (2 - improper parameter).`);
                        }

                    } else {
                        done(`calling getTossupsByCategoryID with value(s) ${test4} does not return a properly formatted response`);
                    }
                }).catch((err) => {
                    done(`calling getTossupsByCategoryID with value ${test4} returns an error.`);
                })
            });
        });

        describe('#getTossupsByParameters(difficulty_list:[int] subcat_id_list:[int], limit:int)', function () {
            var test1 = [[1], [1], 1]; // fa/other 1 tu
            var test2 = [[1, 2, 3], [4, 20, 24], 20]; // chinese myth 10 tu
            var test3 = [[281, 283, 878], [11, 22], 100]; // error does not exist (1)
            var test4 = ["hello", "world"]; // error improper parameter (2)
            it(`Return 1 tossup from difficulty 1 euro lit.`, function (done) {
                questionService.getTossupsByParameters(test1[0], test1[1], test1[2]).then(({status, result}) => {

                    if (status && result) {
                        if (status === "ok") {
                            if (result.length === test1[2]) {
                                done();
                            } else {
                                done("Returned greater or less than " + test1[2] + " tossup(s)");
                            }
                        } else {
                            done(`calling getTossupsByParameters with value ${test1} should return with an "ok" response.`);
                        }

                    } else {
                        done(`calling getTossupsByParameters with value ${test1} does not return a properly formatted response`);
                    }
                }).catch((err) => {
                    done(`calling getTossupsByParameters with value ${test1} returns an error.`);
                })
            });

            it(`Return 20 tossups from parameters ${test2}`, function (done) {
                questionService.getTossupsByParameters(test2[0], test2[1], test2[2]).then(({status, result}) => {
                    if (status && result) {
                        if (status === "ok") {
                            if (result.length === test2[2]) {
                                done();
                            } else {
                                done("Returned greater or less than " + test2[2] + " tossup(s)");
                            }

                        } else {
                            done(`calling getTossupsByParameters with value ${test2} should return with an "ok" response.`);
                        }

                    } else {
                        done(`calling getTossupsByParameters with value ${test2} does not return a properly formatted response`);
                    }
                }).catch((err) => {
                    done(`calling getTossupsByParameters with value ${test2} returns an error.`);
                })
            });

            it(`Error code 1 for parameters ${test3}`, function (done) {
                questionService.getTossupsByParameters(test3[0], test3[1], test3[2]).then(({status, result}) => {
                    if (status && result) {
                        if (status === "fail" && result.error_code && result.error_code === 1) {
                            done();
                        } else {
                            done(`calling getTossupsByParameters with value(s) ${test3} should return with a "fail" response and the proper error response (1 - does not exist). [returned ${status} - ${JSON.stringify(result)}]`);
                        }

                    } else {
                        done(`calling getTossupsByParameters with value(s) ${test3} does not return a properly formatted response`);
                    }
                }).catch((err) => {
                    done(`calling getTossupsByParameters with value ${test3} returns an error.`);
                })
            });

            it(`Error code 2 for parameters ${test4}`, function (done) {
                questionService.getTossupsByParameters(test4[0], test4[1], test4[2]).then(({status, result}) => {
                    if (status && result) {
                        if (status === "fail" && result.error_code && result.error_code === 2) {
                            done();
                        } else {
                            done(`calling getTossupsByParameters with value(s) ${test4} should return with a "fail" response and the proper error response (2 - improper parameter).`);
                        }

                    } else {
                        done(`calling getTossupsByParameters with value(s) ${test4} does not return a properly formatted response`);
                    }
                }).catch((err) => {
                    done(`calling getTossupsByParameters with value ${test4} returns an error.`);
                })
            });

        })

        describe('#getBonusByID(id:int)', function () {
            const test1 = 472 // ok
            const test2 = 1355 // ok
            const test3 = 444377 // error code 1
            const test4 = "ee" // error code 2

            it(`Return bonus ${test1}`, function (done) {
                questionService.getBonusByID(test1).then(({status, result}) => {
                    if (status === "ok") {
                        done();
                    } else {
                        done("returned status 'fail'");
                    }
                })
            })

            it(`Return bonus ${test2}`, function (done) {
                questionService.getBonusByID(test2).then(({status, result}) => {
                    if (status === "ok") {
                        done();
                    } else {
                        done("returned status 'fail'");
                    }
                })
            })

            it(`Error code 1 for ${test3}`, function (done) {
                questionService.getBonusByID(test3).then(({status, result}) => {
                    if (status === "fail" && result.error_code === 1) {
                        done();
                    } else {
                        done("returned status 'ok'");
                    }
                })
            })

            it(`Error code 2 for ${test4}`, function (done) {
                questionService.getBonusByID(test4).then(({status, result}) => {
                    if (status === "fail" && result.error_code === 2) {
                        done();
                    } else {
                        done("returned status 'ok'");
                    }
                })
            })

        });

        describe('#getBonusesByParameters(difficulty_list:[int] subcat_id_list:[int], limit:int)', function () {
            var test1 = [[3], [1], 1];
            var test2 = [[1, 2, 3, 5, 8], [4, 20, 24, 1], 30];
            var test3 = [[281, 283, 878, 44], [11, 22, 99], 100]; // error does not exist (1)
            var test4 = ["hello", "world"]; // error improper parameter (2)
            it(`Return 1 bonus from difficulty 3 euro lit.`, function (done) {
                questionService.getBonusesByParameters(test1[0], test1[1], test1[2]).then(({status, result}) => {

                    if (status && result) {
                        if (status === "ok") {
                            if (result.length === test1[2]) {
                                done();
                            } else {
                                done("Returned greater or less than " + test1[2] + " bonuses(s)");
                            }
                        } else {
                            done(`calling getBonusesByParameters with value ${test1} should return with an "ok" response.`);
                        }

                    } else {
                        done(`calling getBonusesByParameters with value ${test1} does not return a properly formatted response`);
                    }
                }).catch((err) => {
                    done(`calling getBonusesByParameters with value ${test1} returns an error.`);
                })
            });

            it(`Return 20 bonuses from parameters ${test2}`, function (done) {
                questionService.getBonusesByParameters(test2[0], test2[1], test2[2]).then(({status, result}) => {
                    if (status && result) {
                        if (status === "ok") {
                            if (result.length === test2[2]) {
                                done();
                            } else {
                                done("Returned greater or less than " + test2[2] + " bonuses(s)");
                            }

                        } else {
                            done(`calling getBonusesByParameters with value ${test2} should return with an "ok" response.`);
                        }

                    } else {
                        done(`calling getBonusesByParameters with value ${test2} does not return a properly formatted response`);
                    }
                }).catch((err) => {
                    done(`calling getBonusesByParameters with value ${test2} returns an error.`);
                })
            });

            it(`Error code 1 for parameters ${test3}`, function (done) {
                questionService.getBonusesByParameters(test3[0], test3[1], test3[2]).then(({status, result}) => {
                    if (status && result) {
                        if (status === "fail" && result.error_code && result.error_code === 1) {
                            done();
                        } else {
                            done(`calling getBonusesByParameters with value(s) ${test3} should return with a "fail" response and the proper error response (1 - does not exist). [returned ${status} - ${JSON.stringify(result)}]`);
                        }

                    } else {
                        done(`calling getBonusesByParameters with value(s) ${test3} does not return a properly formatted response`);
                    }
                }).catch((err) => {
                    done(`calling getBonusesByParameters with value ${test3} returns an error.`);
                })
            });

            it(`Error code 2 for parameters ${test4}`, function (done) {
                questionService.getBonusesByParameters(test4[0], test4[1], test4[2]).then(({status, result}) => {
                    if (status && result) {
                        if (status === "fail" && result.error_code && result.error_code === 2) {
                            done();
                        } else {
                            done(`calling getBonusesByParameters with value(s) ${test4} should return with a "fail" response and the proper error response (2 - improper parameter).`);
                        }

                    } else {
                        done(`calling getBonusesByParameters with value(s) ${test4} does not return a properly formatted response`);
                    }
                }).catch((err) => {
                    done(`calling getBonusesByParameters with value ${test4} returns an error.`);
                })
            });

        })


    });

    describe('expressService', function () {


        it('Cold starts express server', function (done) {
            if (expressService.server) {
                done();
            } else {

                console.log("   - Some tests were not run because the express server could not start.".red.bold);
                done("Express server did not start on port 8080");
            }

        });


        it('Returns 200 on path "/"', function (done) {
            this.timeout(5000);
            if (!expressService.server) {
                done("Express server did not start")
            } else {
                chai.request(expressService.app)
                    .get('/')
                    .end((err, res) => {
                        res.should.have.status(200);
                        done();
                    });
            }
        });

        describe('expressService-questions', function () {
            it('Returns a tossup on path "/api/tossups?type=id&id=59771"', function (done) {
                this.timeout(5000);
                if (!expressService.server) {
                    done("Express server did not start")
                } else {
                    chai.request(expressService.app)
                        .get('/api/tossups?type=id&id=59771')
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                }
            });

            it('Returns a bonus on path "/api/bonuses?type=id&id=498"', function (done) {
                this.timeout(5000);
                if (!expressService.server) {
                    done("Express server did not start")
                } else {
                    chai.request(expressService.app)
                        .get('/api/bonuses?type=id&id=498')
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                }
            });

            it('Returns 10 tossups on path /api/tossups?type=cat&cat=15&limit=10"', function (done) {
                this.timeout(5000);
                if (!expressService.server) {
                    done("Express server did not start")
                } else {
                    chai.request(expressService.app)
                        .get('/api/tossups?type=cat&cat=15&limit=10')
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                }
            });


            it('Returns 10 tossups on path /api/tossups?type=subcat&subcat=25&limit=10"', function (done) {
                this.timeout(5000);
                if (!expressService.server) {
                    done("Express server did not start")
                } else {
                    chai.request(expressService.app)
                        .get('/api/tossups?type=subcat&subcat=25&limit=10')
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                }
            });

            it('Returns 3 tossups on path /api/tossups?type=param&diffis=[1]&subcats=[4]&limit=3"', function (done) {
                this.timeout(5000);
                if (!expressService.server) {
                    done("Express server did not start")
                } else {
                    chai.request(expressService.app)
                        .get('/api/tossups?type=param&diffis=[1]&subcats=[4]&limit=3')
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                }
            });

            it('Returns 3 bonuses on path /api/bonuses?type=param&diffis=[3]&subcats=[4]&limit=3"', function (done) {
                this.timeout(5000);
                if (!expressService.server) {
                    done("Express server did not start")
                } else {
                    chai.request(expressService.app)
                        .get('/api/bonuses?type=param&diffis=[3]&subcats=[4]&limit=3')
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                }
            });

        });

        describe('#expressService-errors', function () {

            // Missing ID
            it('Returns error 1000 on path "/api/bonuses?type=id&id="', function (done) {
                this.timeout(5000);
                if (!expressService.server) {
                    done("Express server did not start")
                } else {
                    chai.request(expressService.app)
                        .get('/api/bonuses?type=id&id=')
                        .end((err, res) => {
                            res.should.have.status(400);
                            if (JSON.parse(res.text).error.error_code === 1000) {
                                done();
                            } else {
                                done("Returned wrong error code");
                            }
                        });
                }
            });

            // ID is not an integer
            it('Returns error 1001 on path "/api/bonuses?type=id&id=foo"', function (done) {
                this.timeout(5000);
                if (!expressService.server) {
                    done("Express server did not start")
                } else {
                    chai.request(expressService.app)
                        .get('/api/bonuses?type=id&id=foo')
                        .end((err, res) => {
                            res.should.have.status(400);
                            if (JSON.parse(res.text).error.error_code === 1001) {
                                done();
                            } else {
                                done("Returned wrong error code");
                            }
                        });
                }
            });

            // Missing Category
            it('Returns error 1002 tossups on path /api/tossups?type=cat&cat="', function (done) {
                this.timeout(5000);
                if (!expressService.server) {
                    done("Express server did not start")
                } else {
                    chai.request(expressService.app)
                        .get('/api/tossups?type=cat&cat=')
                        .end((err, res) => {
                            res.should.have.status(400);
                            if (JSON.parse(res.text).error.error_code === 1002) {
                                done();
                            } else {
                                done("Returned wrong error code");
                            }
                        });
                }
            });
            // Category is not an integer
            it('Returns error 1003 tossups on path /api/tossups?type=cat&cat=foo&limit=10"', function (done) {
                this.timeout(5000);
                if (!expressService.server) {
                    done("Express server did not start")
                } else {
                    chai.request(expressService.app)
                        .get('/api/tossups?type=cat&cat=foo&limit=10')
                        .end((err, res) => {
                            res.should.have.status(400);
                            if (JSON.parse(res.text).error.error_code === 1003) {
                                done();
                            } else {
                                done("Returned wrong error code");
                            }
                        });
                }
            });
            // Missing Subcategory
            it('Returns error 1004 tossups on path /api/tossups?type=subcat&subcat="', function (done) {
                this.timeout(5000);
                if (!expressService.server) {
                    done("Express server did not start")
                } else {
                    chai.request(expressService.app)
                        .get('/api/tossups?type=subcat&subcat=')
                        .end((err, res) => {
                            res.should.have.status(400);
                            if (JSON.parse(res.text).error.error_code === 1004) {
                                done();
                            } else {
                                done("Returned wrong error code");
                            }
                        });
                }
            });

            // Subcategory is not an integer
            it('Returns error 1005 tossups on path /api/tossups?type=subcat&subcat=foo&limit=10"', function (done) {
                this.timeout(5000);
                if (!expressService.server) {
                    done("Express server did not start")
                } else {
                    chai.request(expressService.app)
                        .get('/api/tossups?type=subcat&subcat=foo&limit=10')
                        .end((err, res) => {
                            res.should.have.status(400);
                            if (JSON.parse(res.text).error.error_code === 1005) {
                                done();
                            } else {
                                done("Returned wrong error code");
                            }
                        });
                }
            });

            // Missing Limit
            it('Returns error 1006 tossups on path /api/tossups?type=subcat&subcat=25&limit="', function (done) {
                this.timeout(5000);
                if (!expressService.server) {
                    done("Express server did not start")
                } else {
                    chai.request(expressService.app)
                        .get('/api/tossups?type=subcat&subcat=25&limit=')
                        .end((err, res) => {
                            res.should.have.status(400);
                            if (JSON.parse(res.text).error.error_code === 1006) {
                                done();
                            } else {
                                done("Returned wrong error code");
                            }
                        });
                }
            });

            // Limit is not an integer
            it('Returns error 1007 tossups on path /api/tossups?type=subcat&subcat=25&limit=foo"', function (done) {
                this.timeout(5000);
                if (!expressService.server) {
                    done("Express server did not start")
                } else {
                    chai.request(expressService.app)
                        .get('/api/tossups?type=subcat&subcat=25&limit=foo')
                        .end((err, res) => {
                            res.should.have.status(400);
                            if (JSON.parse(res.text).error.error_code === 1007) {
                                done();
                            } else {
                                done("Returned wrong error code");
                            }
                        });
                }
            });

            // Missing Difficulty List
            it('Returns error 1008 tossups on path /api/tossups?type=param&diffis=&subcats=[4]&limit=3"', function (done) {
                this.timeout(5000);
                if (!expressService.server) {
                    done("Express server did not start")
                } else {
                    chai.request(expressService.app)
                        .get('/api/tossups?type=param&diffis=&subcats=[3]&limit=3')
                        .end((err, res) => {
                            res.should.have.status(400);
                            if (JSON.parse(res.text).error.error_code === 1008) {
                                done();
                            } else {
                                done("Returned wrong error code");
                            }
                        });
                }
            });

            // Difficulty List is not an array
            it('Returns error 1009 tossups on path /api/tossups?type=param&diffis=foo&subcats=[4]&limit=3"', function (done) {
                this.timeout(5000);
                if (!expressService.server) {
                    done("Express server did not start")
                } else {
                    chai.request(expressService.app)
                        .get('/api/tossups?type=param&diffis=foo&subcats=[3]&limit=3')
                        .end((err, res) => {
                            res.should.have.status(400);
                            if (JSON.parse(res.text).error.error_code === 1009) {
                                done();
                            } else {
                                done("Returned wrong error code");
                            }
                        });
                }
            });

            // Missing Subcategory List
            it('Returns error 1010 tossups on path /api/tossups?type=param&diffis=[3]&subcats=&limit=3"', function (done) {
                this.timeout(5000);
                if (!expressService.server) {
                    done("Express server did not start")
                } else {
                    chai.request(expressService.app)
                        .get('/api/tossups?type=param&diffis=[3]&subcats=&limit=3')
                        .end((err, res) => {
                            res.should.have.status(400);
                            if (JSON.parse(res.text).error.error_code === 1010) {
                                done();
                            } else {
                                done("Returned wrong error code");
                            }
                        });
                }
            });

            // Subcategory List is not an array
            it('Returns error 1011 tossups on path /api/tossups?type=param&diffis=[3]&subcats=foo&limit=3"', function (done) {
                this.timeout(5000);
                if (!expressService.server) {
                    done("Express server did not start")
                } else {
                    chai.request(expressService.app)
                        .get('/api/tossups?type=param&diffis=[3]&subcats=foo&limit=3')
                        .end((err, res) => {
                            res.should.have.status(400);
                            if (JSON.parse(res.text).error.error_code === 1011) {
                                done();
                            } else {
                                done("Returned wrong error code");
                            }
                        });
                }
            });
        });

        //http://localhost:8080/api/tossups?type=id&id=59771 - mindanao


        afterEach(function () {
            expressService.server.close();
        })


    });

    describe('websocketService', function () {
        describe('Origin authentication', function () {
            it('Does not authenticate undefined origin', function (done) {
                if(websocketService.originAuth(undefined)) {
                    done("Authenticated an undefined origin. This MUST be fixed before merge to prod.");
                } else {
                    done();
                }
            })
        })
    });

    describe('dataService', function () {

        it('Does not return an error for local path /tests (Should return undefined or null)', function (done) {

            if(!dataService.getDB()) {
                done(); // The database is empty.
            }

            if(!dataService.getDB().tests) {
                done();
            } else {
                dataService.removeEntry("/tests").then(() => {
                    done();
                }).catch((err) => {
                    done("Test directory on remote or on local db is not empty.");
                })
            }
        })

        describe('Entry creation and deletion', function () {
            it('Creates and deletes entry {id: "test"} on path /tests', function (done) {
                dataService.addEntry("/tests", {id: "test"}).then((res) => {
                    dataService.removeEntry("/tests/" + res.key).then(() => {
                        done();
                    }).catch((err) => {
                        done(err);
                    })
                }).catch((err) => {
                    done(err);
                })
            })

            it('Creates and deletes entry {id: "deep_test"} on path /tests/deep/test/path', function (done) {
                dataService.addEntry("/tests/deep/test/path", {id: "deep_test"}).then((res) => {
                    dataService.removeEntry("/tests/deep/test/path/" + res.key).then(() => {
                        done();
                    }).catch((err) => {
                        done(err);
                    })
                }).catch((err) => {
                    done(err);
                })
            })
        })

        describe('Data updates', function () {
            it('Creates, updates, then deletes entry {id: "test"} on path /tests', function (done) {
                dataService.addEntry("/tests", {id: "test"}).then((res) => {
                    dataService.editEntry("/tests/" + res.key, {id: "test_edited"}).then(() => {
                        dataService.removeEntry("/tests/" + res.key).then(() => {
                            done();
                        }).catch((err) => {
                            done(err);
                        })
                    }).catch((err) => {
                        done(err);
                    })
                }).catch((err) => {
                    done(err);
                })
            })

            it('Creates, updates, then deletes entry {id: "deep_test"} on path /tests/deep/test/path', function (done) {
                dataService.addEntry("/tests/deep/test/path", {id: "deep_test"}).then((res) => {
                    dataService.editEntry("/tests/deep/test/path/" + res.key, {id: "deep_test_edited"}).then(() => {
                        dataService.removeEntry("/tests/deep/test/path/" + res.key).then(() => {
                            done();
                        }).catch((err) => {
                            done(err);
                        })
                    }).catch((err) => {
                        done(err);
                    })
                }).catch((err) => {
                    done(err);
                })
            })
        });

    });
})

