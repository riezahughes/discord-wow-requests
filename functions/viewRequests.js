//some simple pseudo

/*

A user will use the syntax "!myrequests"
There will be a check on the table of all requests from the user that aren't completed.
The bot will respond to the user with a quick summary of whats currently on the board.

*/
const db = require("../db/index.js")

const viewRequests = async (userid) => {
    return db.listRequests(userid);
}

module.exports.viewRequests = viewRequests;