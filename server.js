// Running this will load in all of the modules and start the server. New modules should not be written directly here, instead, they should be require()'d.
// Before your PR is accepted, you must write and pass your tests. (npm run test)
// Server should be started with "npm run start".

const expressModule = require("./bagel_modules/expressService");
const wsModule = require("./bagel_modules/websocketServer");
expressModule.run();


