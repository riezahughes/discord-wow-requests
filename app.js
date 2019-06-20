//env setup
require('dotenv').config()
//require the discord js libraryr
const Discord = require('discord.js');
//create client connection variable
const client = new Discord.Client();

//functions for dealing with bot requests.
const request = require('./functions/createRequest');
const deposit = require('./functions/createDeposit');
const view = require('./functions/viewRequests');

//when the bot boots
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


//on a message (by default it checks every channel)
client.on('message', msg => {

    if(!msg.author.bot){
        //msg.content.includes
        //if it's just checking requests
        if(msg.content.toLowerCase() === "!myrequests"){
            msg.reply(view.viewRequests());
        }

        //otherwise take the string that the user has entered. Split it into two pieces. The command and the items/values
        //Make the command lowercase for easy checks.

        let commandSplit = msg.content.substr(0,msg.content.indexOf(' '));
        commandSplit = commandSplit.toLowerCase();

        let requestItems = msg.content.substr(msg.content.indexOf(' ')+1);
        
        //quick test to show things going through correctly.
        console.log(commandSplit + " of " + requestItems + " from " + msg.member.user.tag + " ( id:" + msg.member.id + " )");

        
        if(commandSplit === "!request"){
            

            msg.reply(request.createRequest());
        }

        if(commandSplit === "!deposit"){
            msg.reply(deposit.createDeposit());
        }

    }
});

//log in the bot via the bot token from discord.
client.login(process.env.DISCORDBOTTOKEN);