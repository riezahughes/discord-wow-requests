//env setup
require("dotenv").config()
//require the discord js libraryr
const Discord = require("discord.js")
//create client connection variable
const client = new Discord.Client()

//functions for dealing with bot requests.
const request = require("./functions/createRequest")
const deposit = require("./functions/createDeposit")
const view = require("./functions/viewRequests")

const createEmbed = (
  setupMessageId,
  memberId,
  shoppingList,
  shoppingQuantity
) => ({
  title: `:id: \`${setupMessageId}\` - New Request From: `,
  description: `\n\n<@${memberId}>`,
  color: 5508893,
  timestamp: "2019-06-20T22:07:57.142Z",
  footer: {
    icon_url: "https://cdn.discordapp.com/embed/avatars/0.png",
    text: "Be excellent to each other"
  },
  thumbnail: {
    url: "https://cdn.discordapp.com/embed/avatars/0.png"
  },

  fields: [
    {
      name: "Item",
      value: `\`\`\`${shoppingList}\`\`\``,
      inline: true
    },
    {
      name: "Quantity Needed:",
      value: `\`\`\`${shoppingQuantity}\`\`\``,
      inline: true
    }
  ]
})

//when the bot boots
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

//on a message (by default it checks every channel)
client.on("message", async (msg) => {
  if (!msg.author.bot) {
    //msg.content.includes
    //if it's just checking requests
    if (msg.content.toLowerCase() === "!myrequests") {
      let userResponse = ""
      const viewResponse = await view.viewRequests(msg.member.id)
      if (!viewResponse) {
        msg.reply("You don't have any pending requests at this time.")
      } else {
        userResponse = "```Current Requests```"
        for (i = 0; i < viewResponse.length; i++) {
          userResponse +=
            viewResponse[i].current_quantity +
            " / " +
            viewResponse[i].initial_quantity +
            " of " +
            viewResponse[i].item_name +
            " " +
            "collected.\n"
        }
        msg.reply(userResponse)
      }
    }

    //otherwise take the string that the user has entered. Split it into two pieces. The command and the items/values
    //Make the command lowercase for easy checks.

    let commandSplit = msg.content.substr(0, msg.content.indexOf(" "))
    commandSplit = commandSplit.toLowerCase()

    let requestItems = msg.content.substr(msg.content.indexOf(" ") + 1)

    let shoppingQuantity = requestItems.substr(0, requestItems.indexOf(" "))
    let shoppingList = requestItems.substr(requestItems.indexOf(" ") + 1)

    //quick test to show things going through correctly.
    console.log(
      commandSplit +
      " of " +
      requestItems +
      " from " +
      msg.member.user.tag +
      " ( id:" +
      msg.member.id +
      " )"
    )

    if (commandSplit === "!request" && !isNaN(shoppingQuantity)) {
      const setupMessage = await client.channels
        .get(process.env.BOTCHANNEL)
        .send("[processing]")

      const runRequest = await request.createRequest(
        msg.member.id,
        setupMessage.id,
        shoppingList,
        shoppingQuantity
      )

      if (runRequest) {
        console.log(runRequest)

        const richembed = createEmbed(
          runRequest[0].id,
          msg.member.id,
          shoppingList,
          shoppingQuantity
        )

        try {

          const message = await client.channels
            .get(process.env.BOTCHANNEL)
            .fetchMessage(setupMessage.id)

          await message.edit({ embed: richembed })

          const returnResponse = "Request Created! :id:: ` " + runRequest[0].id + " `"
          msg.reply(
            `${returnResponse}! Check <#${process.env.BOTCHANNEL}> for post`
          )
        } catch (e) {
          console.error(e)
        }
      } else {
        msg.reply("Format incorrect. Please try again. `!request [qty] [item]`")
      }
    }

    if (commandSplit === "!deposit") {
      msg.reply(deposit.createDeposit())
    }
  }
})

//log in the bot via the bot token from discord.
client.login(process.env.DISCORDBOTTOKEN)
