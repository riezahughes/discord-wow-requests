const { Pool } = require("pg")
const request = require("./request")
const pool = new Pool()

module.exports = {
  createRequest: request.createRequest(pool),
  listRequests: request.listRequests(pool),
  listAllRequests: request.listAllRequests(pool),
  depositRequest: request.depositRequest(pool),
  deleteRequest: request.deleteRequest(pool)
}
