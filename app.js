require('dotenv').config()
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

    if(!msg.author.bot){
        if(msg.content.includes("!request")){

            msg.reply("Request");
        }

        if(msg.content.includes("!deposit")){
            msg.reply("Deposit");
        }

        if(msg.content.includes("!myrequests")){
            msg.reply("list all requests");
        }
    }
});

client.login(process.env.DISCORDBOTTOKEN);