//some simple pseudo

/*

A user will create a request using the syntax "!request [number] [item]". User must have a rank required for it. 
The users id, item and quantity and a current quantity of zero are stored in a table. 
A post will be made to a specified channel called "requests" with a particular markup to show the request. (perhaps a lookup to show the right picture if feeling fancy)
the post will have the ID of the request, what item, who requested it (as a tag) and how much still needs to be collected.
A response will be given to the user saying the request has been taken. 

*/
function createRequest(userid, qty, item){
    return "Created a Request"
}

module.exports.createRequest = createRequest;