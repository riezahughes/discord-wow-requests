
const db = require("../db")

const deleteRequest = async (id) => {
    console.log("mini file: " + id);
    return db.deleteRequest(id)
}

module.exports.deleteRequest = deleteRequest
