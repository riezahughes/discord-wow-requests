//some simple pseudo

/*

A user will create a deposit using the syntax "!deposit [number] [item] [ID]" where ID is the id of the request, viewable on the requests board.
First, the bot will find the row with the matching id. It will then check if the entered value + current_value is higher or equal than the request value.

If it is, then that row is marked as complete, the original poster is notified via pm that the request is complete, the post on the request board is deleted and feedback to the user is given to say that the request is completed. 

If it is not, then the value is updated in the db row. The user is told how much is left to go and the post in the request board is updated to show how much is remaining.

*/

const db = require("../db")

const createDeposit = async (post_id, quantity) => {
  return db.depositRequest(post_id, quantity)
}

module.exports.createDeposit = createDeposit
