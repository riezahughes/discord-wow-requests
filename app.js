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

            const response = await view.viewRequests(msg.member.id);
            
            console.log(response);

            msg.reply(response);

        }

        //otherwise take the string that the user has entered. Split it into two pieces. The command and the items/values
        //Make the command lowercase for easy checks.

        let commandSplit = msg.content.substr(0,msg.content.indexOf(' '));
        commandSplit = commandSplit.toLowerCase();

        let requestItems = msg.content.substr(msg.content.indexOf(' ')+1);
        
        let shoppingQuantity = requestItems.substr(0,requestItems.indexOf(' '));
        let shoppingList = requestItems.substr(requestItems.indexOf(' ')+1);

        //quick test to show things going through correctly.
        console.log(commandSplit + " of " + requestItems + " from " + msg.member.user.tag + " ( id:" + msg.member.id + " )");

        
        if(commandSplit === "!request" && !isNaN(shoppingQuantity)){
            let runRequest = request.createRequest(msg.member.id, shoppingList,shoppingQuantity);
            if(runRequest.success === true){

                let richembed = 
                      {
                        "title": ":id: `123` - New Request From: ",
                        "description": "\n\n<@"+ msg.member.id +">",
                        "color": 5508893,
                        "timestamp": "2019-06-20T22:07:57.142Z",
                        "footer": {
                          "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
                          "text": "Be excellent to each other"
                        },
                        "thumbnail": {
                          "url": "https://cdn.discordapp.com/embed/avatars/0.png"
                        },
                  
                        "fields": [
                  
                          {
                            "name": "Item",
                            "value": "```"+ shoppingList +"```",
                            "inline": true
                          },
                          {
                            "name": "Quantity Needed:",
                            "value": "```"+ shoppingQuantity +"```",
                            "inline": true
                          }
                        ]
                      };

                client.channels.get(process.env.BOTCHANNEL).send({embed: richembed});

                let returnResponse = "Request Created! :id:: ` "+ runRequest.id +" `";
                msg.reply(`${returnResponse}! Check <#${process.env.BOTCHANNEL}> for post`);

            }else{
                msg.reply("Format incorrect. Please try again. `!request [qty] [item]`");
            }
            
        }

        if(commandSplit === "!deposit"){
            msg.reply(deposit.createDeposit());
        }
        

    }
});

//log in the bot via the bot token from discord.
client.login(process.env.DISCORDBOTTOKEN);