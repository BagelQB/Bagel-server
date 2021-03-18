/*
    TESTS ARE IMPORTANT!

    Before submitting a PR make sure you have written and passed your tests so we don't royally screw up something.
    (npm test)


*/


var questionService = require('../bagel_modules/questionService');
var translatorService = require('../bagel_modules/translatorService');

describe('Bagel Services', function () {
    describe('questionService', function () {
       describe('#getTossupByID(id:int)', function() {
            var q1ID = 82906;
            var q2ID = 69177;
            var q3ID = 38278376824;
            var q4ID = "not_an_int";

            it('Return proper status code and tossup for id ' + q1ID, function(done) {
                questionService.getTossupByID(q1ID).then(({status, result}) => {
                    if(status && result) {
                        if(status === "ok") {
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

            it('Return proper status code and tossup for id ' + q2ID, function(done) {
                questionService.getTossupByID(q2ID).then(({status, result}) => {
                    if(status && result) {
                        if(status === "ok") {
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

            it('Error code 1 for id ' + q3ID, function(done) {
                questionService.getTossupByID(q3ID).then(({status, result}) => {
                    if(status && result) {
                        if(status === "fail" && result.error_code && result.error_code === 1) {
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

            it('Error code 2 for id ' + q4ID, function(done) {
                questionService.getTossupByID(q4ID).then(({status, result}) => {
                    if(status && result) {
                        if(status === "fail" && result.error_code && result.error_code === 2) {
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

       describe('#getTossupsBySubcatID(subcat_id:int, limit:int)', function() {
            var test1 = [25, 1]; // fa/other 1 tu
            var test2 = [1, 10]; // chinese myth 10 tu
            var test3 = [283, 100]; // error does not exist (1)
            var test4 = ["hello", "world"]; // error improper parameter (2)
            it(`Return 1 tossup from Fine Arts/Other`, function(done) {
                questionService.getTossupsBySubcatID(test1[0], test1[1]).then(({status, result}) => {

                    if(status && result) {
                        if(status === "ok") {
                            if(result.length === 1) {
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

            it(`Return 10 tossups from Literature/European`, function(done) {
                questionService.getTossupsBySubcatID(test2[0], test2[1]).then(({status, result}) => {
                    if(status && result) {
                        if(status === "ok") {
                            if(result.length === 10) {
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

            it(`Error code 1 for parameters ${test3}` , function(done) {
                questionService.getTossupsBySubcatID(test3[0], test3[1]).then(({status, result}) => {
                    if(status && result) {
                        if(status === "fail" && result.error_code && result.error_code === 1) {
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

            it(`Error code 2 for parameters ${test4}`, function(done) {
                questionService.getTossupsBySubcatID(test4[0], test4[1]).then(({status, result}) => {
                    if(status && result) {
                        if(status === "fail" && result.error_code && result.error_code === 2) {
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

       describe('#getTossupsByCategoryID(cat_id:int, limit:int)', function() {
            var test1 = [15, 1]; 
            var test2 = [18, 10]; 
            var test3 = [333333, 100]; // error does not exist (1)
            var test4 = ["hello", "world"]; // error improper parameter (2)
            it(`Return 1 tossup from category 15`, function(done) {
                questionService.getTossupsByCategoryID(test1[0], test1[1]).then(({status, result}) => {

                    if(status && result) {
                        if(status === "ok") {
                            if(result.length === 1) {
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

            it(`Return 10 tossups from category 18`, function(done) {
                questionService.getTossupsByCategoryID(test2[0], test2[1]).then(({status, result}) => {
                    if(status && result) {
                        if(status === "ok") {
                            if(result.length === 10) {
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

            it(`Error code 1 for parameters ${test3}` , function(done) {
                questionService.getTossupsByCategoryID(test3[0], test3[1]).then(({status, result}) => {
                    if(status && result) {
                        if(status === "fail" && result.error_code && result.error_code === 1) {
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

            it(`Error code 2 for parameters ${test4}`, function(done) {
                questionService.getTossupsByCategoryID(test4[0], test4[1]).then(({status, result}) => {
                    if(status && result) {
                        if(status === "fail" && result.error_code && result.error_code === 2) {
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

       describe('#getTossupsByParameters(difficulty_list:[int] subcat_id_list:[int], limit:int)', function() {
            var test1 = [[1], [1], 1]; // fa/other 1 tu
            var test2 = [[1, 2, 3], [4, 20, 24], 20]; // chinese myth 10 tu
            var test3 = [[281, 283,878], [11, 22], 100]; // error does not exist (1)
            var test4 = ["hello", "world"]; // error improper parameter (2)
            it(`Return 1 tossup from difficulty 1 euro lit.`, function(done) {
                questionService.getTossupsByParameters(test1[0], test1[1], test1[2]).then(({status, result}) => {

                    if(status && result) {
                        if(status === "ok") {
                            if(result.length === test1[2]) {
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

            it(`Return 20 tossups from parameters ${test2}`, function(done) {
                questionService.getTossupsByParameters(test2[0], test2[1], test2[2]).then(({status, result}) => {
                    if(status && result) {
                        if(status === "ok") {
                            if(result.length === test2[2]) {
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

            it(`Error code 1 for parameters ${test3}` , function(done) {
                questionService.getTossupsByParameters(test3[0], test3[1], test3[2]).then(({status, result}) => {
                    if(status && result) {
                        if(status === "fail" && result.error_code && result.error_code === 1) {
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

            it(`Error code 2 for parameters ${test4}`, function(done) {
                questionService.getTossupsByParameters(test4[0], test4[1], test4[2]).then(({status, result}) => {
                    if(status && result) {
                        if(status === "fail" && result.error_code && result.error_code === 2) {
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

       describe('#getBonusByID(id:int)', function() {
            const test1 = 472 // ok
            const test2 = 1355 // ok
            const test3 = 444377 // error code 1
            const test4 = "ee" // error code 2

            it(`Return bonus ${test1}`, function(done) {
                questionService.getBonusByID(test1).then(({status, result}) => {
                    if(status === "ok") {
                        done();
                    } else {
                        done("returned status 'fail'");
                    }
                })
            })

            it(`Return bonus ${test2}`, function(done) {
                questionService.getBonusByID(test2).then(({status, result}) => {
                    if(status === "ok") {
                        done();
                    } else {
                        done("returned status 'fail'");
                    }
                })
            })

            it(`Error code 1 for ${test3}`, function(done) {
                questionService.getBonusByID(test3).then(({status, result}) => {
                    if(status === "fail" && result.error_code === 1) {
                        done();
                    } else {
                        done("returned status 'ok'");
                    }
                })
            })

            it(`Error code 2 for ${test4}`, function(done) {
                questionService.getBonusByID(test4).then(({status, result}) => {
                    if(status === "fail" && result.error_code === 2) {
                        done();
                    } else {
                        done("returned status 'ok'");
                    }
                })
            })

       });

      describe('#getBonusesByParameters(difficulty_list:[int] subcat_id_list:[int], limit:int)', function() {
            var test1 = [[3], [1], 1]; 
            var test2 = [[1, 2, 3, 5 ,8], [4, 20, 24, 1], 30];
            var test3 = [[281, 283,878, 44], [11, 22, 99], 100]; // error does not exist (1)
            var test4 = ["hello", "world"]; // error improper parameter (2)
            it(`Return 1 bonus from difficulty 3 euro lit.`, function(done) {
                questionService.getBonusesByParameters(test1[0], test1[1], test1[2]).then(({status, result}) => {

                    if(status && result) {
                        if(status === "ok") {
                            if(result.length === test1[2]) {
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

            it(`Return 20 bonuses from parameters ${test2}`, function(done) {
                questionService.getBonusesByParameters(test2[0], test2[1], test2[2]).then(({status, result}) => {
                    if(status && result) {
                        if(status === "ok") {
                            if(result.length === test2[2]) {
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

            it(`Error code 1 for parameters ${test3}` , function(done) {
                questionService.getBonusesByParameters(test3[0], test3[1], test3[2]).then(({status, result}) => {
                    if(status && result) {
                        if(status === "fail" && result.error_code && result.error_code === 1) {
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

            it(`Error code 2 for parameters ${test4}`, function(done) {
                questionService.getBonusesByParameters(test4[0], test4[1], test4[2]).then(({status, result}) => {
                    if(status && result) {
                        if(status === "fail" && result.error_code && result.error_code === 2) {
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

       describe('#getPartsForBonus(bonus_id:int)', function() {
            const test1 = 4011 // ok
            const test2 = 2713 // ok
            const test3 = 51324536 // error code 1
            const test4 = "test" // error code 2

            it(`Return bonus ${test1}`, function(done) {
                questionService.getPartsForBonus(test1).then(({status, result}) => {
                    if(status === "ok") {
                        done();
                    } else {
                        done("returned status 'fail'");
                    }
                })
            })

            it(`Return bonus ${test2}`, function(done) {
                questionService.getPartsForBonus(test2).then(({status, result}) => {
                    if(status === "ok") {
                        done();
                    } else {
                        done("returned status 'fail'");
                    }
                })
            })

            it(`Error code 1 for ${test3}`, function(done) {
                questionService.getPartsForBonus(test3).then(({status, result}) => {
                    if(status === "fail" && result.error_code === 1) {
                        done();
                    } else {
                        done("returned status 'ok'");
                    }
                })
            })

            it(`Error code 2 for ${test4}`, function(done) {
                questionService.getPartsForBonus(test4).then(({status, result}) => {
                    if(status === "fail" && result.error_code === 2) {
                        done();
                    } else {
                        done("returned status 'ok'");
                    }
                })
            })

       });

    });


    describe('translatorService', function () {
        describe('#tournamentFromID()', function() {


            it('Properly returns tournament from id', function(done) {
                translatorService.tournamentFromID(417).then(({status, result}) => {
                    if(status && status === "ok") {
                        if(result && result.id && result.id === 417) {
                            done();
                        } else {
                            done("returned wrong tournament");
                        }
                    } else {
                        done("Returned with 'fail' status");
                    }
                    
                }).catch((err) => {
                    done(err);
                })
            })


        })

        describe('#getTournamentsWithDifficulty()', function() {

            var d1Tournament_count = 6;
            it('Returns proper tournaments for difficulty 1', function(done) {
                translatorService.getTournamentsWithDifficulty(1).then(({status, result}) => {
                    if(status && status === "ok") {
                        if(result.length === d1Tournament_count) {
                            done();
                        } else {
                            done("Incorrect count");
                        }
                    } else {
                        done("Returned with a result of fail")
                    }

                    
                }).catch((err) => {
                    done(err);
                })
            })
        })


        describe('#getTournamentsWithDifficultyList()', function() {
            for(var i = 1; i < 10; i++) {
                (function(cntr) {
                    it('Returns proper tournaments for difficulty ' + cntr, function(done) {
                        translatorService.getTournamentsWithDifficulty(cntr).then((res) => {
                            translatorService.getTournamentsWithDifficultyList([cntr]).then((res2) => {
                                if(res.result.length === res2.result.length) {
                                    done();
                                } else {
                                    done("Incorrect count");
                                }
                            })
                        })
                        
                    })
                })(i);
            }


        })


    })
})

