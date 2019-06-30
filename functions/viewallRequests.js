
const db = require("../db")

const viewallRequests = async (userid) => {
    return db.listAllRequests(userid)
}

module.exports.viewallRequests = viewallRequests