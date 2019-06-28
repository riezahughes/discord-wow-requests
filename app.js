//env setup
require("dotenv").config()
//require the discord js libraryr
const Discord = require("discord.js")
//create client connection variable
const client = new Discord.Client()

//functions for dealing with bot requests.
const request = require("./functions/createRequest");
const deposit = require("./functions/createDeposit");
const view = require("./functions/viewRequests");
const viewall = require("./functions/viewallRequests");
const update = require("./functions/updateRequest");
const del = require("./functions/deleteRequest");

const createEmbed = (
  setupMessageId,
  memberId,
  shoppingList,
  shoppingQuantity,
  shoppingMax,
) => {
  const shoppingDif = shoppingQuantity / shoppingMax;
  let markup = "";

  if (shoppingDif > 0.666) {
    markup = "yaml"
  }

  if (shoppingDif < 0.666 && shoppingDif > 0.333) {
    markup = "fix"
  }

  if (shoppingDif < 0.333) {
    markup = "brainfuck"
  }

  return {
    title: `:id: \`${setupMessageId}\` - A New Item Request Is Now Available.`,
    description: `Request From: <@${memberId}>`,
    color: 5508893,
    timestamp: "2019-06-20T22:07:57.142Z",
    footer: {
      icon_url: "https://odealo.com/uploads/auction_images//9746195585c17934d35039.png",
      text: "Be excellent to each other"
    },
    thumbnail: {
      url: "https://odealo.com/uploads/auction_images//9746195585c17934d35039.png"
    },

    fields: [
      {
        name: "Item",
        value: `\`\`\`CSS\n${shoppingList}\n\`\`\``,
        inline: false
      },
      {
        name: "Quantity Required:",
        value: `\`\`\`yaml\n${shoppingMax}\n\`\`\``,
        inline: true
      },
      {
        name: "Quantity Left:",
        value: `\`\`\`${markup}\n${shoppingQuantity}\n\`\`\``,
        inline: true
      }
    ]
  }
}

const myRequestsResponse = (responses) => {
  return responses
    .map(
      ({ current_quantity, initial_quantity, item_name, id }) =>
        `ID:${id} ${current_quantity} / ${initial_quantity} of ${item_name} collected.`
    )
    .join("\n")
}

//when the bot boots
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
  client.user.setPresence({ game: { name: "With Yer Maw", type: 0 } })
})

//on a message (by default it checks every channel)
client.on("message", async (msg) => {
  if (msg.author.bot) {
    return
  }
  if (msg.guild === null) {
    return
  }

  const checkRole = msg.member.roles.some(role => role.name === 'Booty Wench');


  let { content, member } = msg
  content = content.toLowerCase();
  //if it's just checking requests
  if (content === "!myrequests" && checkRole) {
    const viewResponse = await view.viewRequests(member.id)
    let userResponse = ""
    //console.log(viewResponse.length);
    if (viewResponse.length === 0) {
      client.users.get(member.id).send("You don't have any pending requests at this time.")
    } else {
      userResponse = myRequestsResponse(viewResponse)
      client.users.get(member.id).send("**Your Current Requests:**```" + userResponse + "```")
    }
  }

  if (content === "!viewall" && checkRole) {
    const viewallResponse = await viewall.viewallRequests(member.id)
    //console.log(viewResponse.length);
    if (!viewallResponse) {
      client.users.get(member.id).send("Sorry, none available.");
    } else {
      userResponse = myRequestsResponse(viewallResponse)
      client.users.get(member.id).send("**All Requests:**```" + userResponse + "```");
    }
  }

  if (content.includes("!deleterequest") && checkRole) {
    let requestId = content.substr(content.indexOf(" ") + 1)
    console.log(requestId);
    const deleteResponse = await del.deleteRequest(requestId);
    console.log(deleteResponse);
    if (deleteResponse.fulfilled) {
      const message = await client.channels
        .get(process.env.BOTCHANNEL)
        .fetchMessage(deleteResponse.post_id)
      await message.delete();
      msg.reply("Request has been deleted. Thanks for letting me know!");
    } else {
      msg.reply("Nothing to delete. Check your `ID`!");
    }
  }

  //otherwise take the string that the user has entered. Split it into two pieces. The command and the items/values
  //Make the command lowercase for easy checks.

  let commandSplit = content.substr(0, content.indexOf(" "))
  commandSplit = commandSplit.toLowerCase()

  let requestItems = content.substr(content.indexOf(" ") + 1)

  let shoppingQuantity = requestItems.substr(0, requestItems.indexOf(" "))
  let shoppingList = requestItems.substr(requestItems.indexOf(" ") + 1)

  //quick test to show things going through correctly.
  // console.log(
  //   commandSplit +
  //   " of " +
  //   requestItems +
  //   " from " +
  //   member.user.tag +
  //   " ( id:" +
  //   member.id +
  //   " )"
  // )

  if (commandSplit === "!request" && !isNaN(shoppingQuantity) && checkRole) {
    const setupMessage = await client.channels
      .get(process.env.BOTCHANNEL)
      .send("[processing]")

    const runRequest = await request.createRequest(
      member.id,
      setupMessage.id,
      shoppingList,
      shoppingQuantity
    )

    if (runRequest) {
      //console.log(runRequest)

      const richembed = createEmbed(
        runRequest[0].id,
        member.id,
        shoppingList,
        shoppingQuantity,
        shoppingQuantity
      )

      try {
        const message = await client.channels
          .get(process.env.BOTCHANNEL)
          .fetchMessage(setupMessage.id)

        await message.edit({ embed: richembed })

        const returnResponse =
          "Request Created! :id:: ` " + runRequest[0].id + " `"
        msg.reply(
          `${returnResponse}! Check <#${process.env.BOTCHANNEL}> for post`
        )
        message.pin();
      } catch (e) {
        console.error(e)
      }
    } else {
      msg.reply("Format incorrect. Please try again. `!request [qty] [item]`")
    }
  }

  if (commandSplit === "!urequest" && checkRole) {
    const itemupdate = await update.updateRequest(
      shoppingList,
      shoppingQuantity
    )

    const message = await client.channels
      .get(process.env.BOTCHANNEL)
      .fetchMessage(itemupdate.post_id)

    const richembed = createEmbed(
      itemupdate.request_id,
      itemupdate.user_id,
      itemupdate.item_name,
      itemupdate.to_go,
      itemupdate.request_max
    )

    await message.edit({ embed: richembed })

    msg.reply("Update successful. There are now currently " + itemupdate.to_go + " " + itemupdate.item_name + " to go!");

  }

  if (commandSplit === "!deposit") {
    const itemdeposit = await deposit.createDeposit(
      shoppingList,
      shoppingQuantity
    )
    //console.log(itemdeposit)
    if (itemdeposit.fulfilled === true) {
      deletePost = await client.channels
        .get(process.env.BOTCHANNEL)
        .fetchMessage(itemdeposit.post_id);
      await deletePost.delete();
      client.users.get(itemdeposit.user_id).send("Your request for " + itemdeposit.item_name + " has been completed. The job and been deleted on the board. Thanks for using me!");
      msg.reply("Request has been completed. The issuer has been notified. Thank you for the help!");
    } else {

      const message = await client.channels
        .get(process.env.BOTCHANNEL)
        .fetchMessage(itemdeposit.post_id)

      const richembed = createEmbed(
        itemdeposit.request_id,
        itemdeposit.user_id,
        itemdeposit.item_name,
        itemdeposit.to_go,
        itemdeposit.request_max
      )

      await message.edit({ embed: richembed })

      msg.reply("Thank you for the help. There is currently " + itemdeposit.to_go + " more to go!");
    }
  }
})

//log in the bot via the bot token from discord.
client.login(process.env.DISCORDBOTTOKEN)
