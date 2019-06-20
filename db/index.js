const { Pool } = require("pg")
const request = require("./request")
const pool = new Pool()

module.exports = {
  createRequest: request.createRequest(pool),
  listRequests: request.listRequests(pool)
}
