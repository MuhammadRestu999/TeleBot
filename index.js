const { Telegraf, Telegram, Markup } = require("telegraf")
const chalk = require("chalk")
const ft = require("./lib/function")
const fs = require("fs")
const os = require("os")
const util = require("util")
const axios = require("axios")
const fetch = require("node-fetch")
const FormData = require("form-data")
const cheerio = require("cheerio")
const jsdom = require("jsdom")
const express = require("express")

const { token, owner, ownerLink, ownerId, version, prefix } = JSON.parse(fs.readFileSync("./config.json"))
const { logger, clockString, parseSeconds, sleep, getAge } = ft

const app = express()
app.get("/", (req, res) => res.send("Hello world"))

global.Markup = Markup
global.Telegram = Telegram
global.Telegraf = Telegraf
global.ft = ft
global.fs = fs
global.util = util
global.axios = axios
global.fetch = fetch
global.FormData = FormData
global.cheerio = cheerio
global.jsdom = jsdom
global.express = express
global.app = app
global.db = {
  data: JSON.parse(fs.readFileSync("db.json"))
}
db.save = function() {
  return new Promise((res, rej) => {
    logger.custom("cyan", "DB", "Saving database")
    fs.writeFile("db.json", JSON.stringify(db.data, null, 2), (e) => {
      if(e) {
        logger.ERROR("[DB] Error")
        console.log(e)
        rej(false)
      } else {
        logger.custom("cyan", "DB", "Successfully save database")
        res(true)
      }
    })
  })
}
db.interval = setInterval(async function() {
  await db.save()
}, 1000*60*1) // Every 1 minute

function watch(f, callback, co) {
  if(!fs.existsSync(f)) return logger.ERROR(`Cannot read file or folder ${f}!`)
  logger.INFO(`Watching ${f}`)
  fs.watch(f, function(type, file) {
    if(file.endsWith(".swp")) return
    if(callback) {
      if(co) return callback()
      else callback()
    }
    if(f[f.split("/").length - 1] != file) {
      if(type == "rename") {
        if(!fs.existsSync(f + file)) logger.WARN(`${file} file deleted`)
        else logger.INFO(`${file} file created`)
      } else if(type == "change") {
        logger.INFO(`File ${file} updated`)
        delete require.cache[require.resolve(f + file)]
        require(f + file)
      }
    } else {
      if(type == "rename") {
        if(!fs.existsSync(file)) logger.WARN(`${file} file deleted`)
        else logger.INFO(`${file} file created`)
      } else if(type == "change") {
        logger.INFO(`File ${file} updated`)
        delete require.cache[require.resolve(file)]
        require(file)
      }
    }
  })
}
watch("./cmd/")
watch("./lib/scrape.js")
watch("./lib/tele.js", () => { global.tele = require("./lib/tele") }, false)
watch("./lib/simple.js", () => { global.simple = require("./lib/simple") }, false)

if(token == "") return logger.ERROR("Tokens cannot be empty!")

const bot = new Telegraf(token)
global.bot = bot

bot.on("new_chat_members", async(up) => {
  global.tele = require("./lib/tele")
  let { message } = up

  if(!db.data.group[message.chat.id]) db.data.group[message.chat.id] = {}
  if(!db.data.group[message.chat.id].member) db.data.group[message.chat.id].member = []

  let gc = message.chat.title
  for(let USER of message.new_chat_members) {
    if(USER.username) db.data.group[message.chat.id].member.push(USER.username)
    let user = tele.getUser(USER)
    let fname = tele.getUser(user).full_name
    logger.custom("cyan", "JOIN", chalk.whiteBright(fname) + " " + chalk.greenBright("join in") + " " + chalk.whiteBright(gc))
    up.reply(`Kon\'nichiwa ${USER.username ? "@" + USER.username : user.full_name}!`)
  }
})
bot.on("left_chat_member", async(up) => {
  global.tele = require("./lib/tele")
  let { message } = up

  if(!db.data.group[message.chat.id]) db.data.group[message.chat.id] = {}
  if(!db.data.group[message.chat.id].member) db.data.group[message.chat.id].member = []

  let user = message.left_chat_member
  let gc = message.chat.title
  let fname = tele.getUser(user).full_name
  if(user.username) {
    if(db.data.group[message.chat.id].member.indexOf(user.username) != -1) db.data.group[message.chat.id].member.splice(db.data.group[message.chat.id].member.indexOf(user.username), 1)
  }
  logger.custom("cyan", "LEAVE", chalk.whiteBright(fname) + " " + chalk.greenBright("leaving group") + " " + chalk.whiteBright(gc))
  up.reply(`Sayōnara ${user.username ? "@" + user.username : fname} 👋`)
})

bot.command("start", async(ctx) => {
  global.tele = require("./lib/tele")
  let user = tele.getUser(ctx.message.from)
  logger.custom("cyan", "COMMAND", `From ${chalk.whiteBright(user.full_name)} cmd ${chalk.cyan(ctx.message.text)}`)
  await ctx.replyWithMarkdown(`Hai @${user.username}!\n\nKirim /help atau /menu untuk melihat list menu\n\nBot ini dibuat oleh [${owner}](${ownerLink}).`, { disable_web_page_preview: true })
})

bot.on("callback_query", async(ctx) => {
  global.tele = require("./lib/tele")
  if(ctx?.callbackQuery?.data == "wnext") {
    let { data } = await axios("https://waifu.pics/api/sfw/waifu")
    let markup = Markup.inlineKeyboard([
      Markup.button.callback("Next", "wnext"),
      Markup.button.callback("Delete", "d")
    ])

    try {
      await ctx.editMessageMedia({
        "type": "photo",
        "media": data.url,
        "caption": `Source: ${data.url}`
      }, {
        ...markup
      })
    } catch(e) {
      console.log(e)
    }
  } else ctx.deleteMessage()
  let Command = fs.readdirSync("./cmd/").filter(v => !v.startsWith(".")).map(v => require(`./cmd/${v}`))
  let { callbackQuery: click } = ctx
  let { from, message } = click
  let user = tele.getUser(from)

  let is = {
    registered: !!global.db.data.users[from?.id],
    group: message?.chat?.type == "supergroup",
    admin: await message?.from?.isAdmin,
    owner: ownerId.includes(from?.id)
  }

  let command = click.data.split(" ")[0]
  let text = click.data.split(" ")
  text.shift()
  text = text.join(" ")
  let cmd = Command.filter(v => v.help.includes(command))[0]
  if(cmd) {
    if(cmd.owner) {
      if(is.owner) {
        cmd.start(ctx, { Telegram: new Telegram(token), user, message, text, is })
      } else {
        ctx.reply("[❌] Hanya owner bot yang dapat menggunakan perintah itu!")
      }
    } else if(cmd.group) {
      if(is.group) {
        if(cmd.admin) {
          if(is.admin) {
            cmd.start(ctx, { Telegram: new Telegram(token), user, message, text: text.split(" ").slice(1).join(" "), is })
          } else {
            ctx.reply("[❌] Hanya admin yang dapat menggunakan perintah itu!")
          }
        }
      } else {
        ctx.reply("[❌] Perintah hanya dapat digunakan di grup!")
      }
    } else if(cmd.registered) {
      if(is.registered) {
        cmd.start(ctx, { Telegram: new Telegram(token), user, message, text, is })
      } else {
        ctx.reply("[❌] Hanya user terdaftar yang dapat menggunakan perintah itu!")
      }
    } else cmd.start(ctx, { Telegram: new Telegram(token), user, message, text, is })
  }
  logger.custom("cyan", "CALLBACK", `From ${user.username ? "@" + user.username : user.full_name} ${chalk.cyan(click.data)}`)
})

bot.on("message", async(ctx) => {
  global.tele = require("./lib/tele")
  global.simple = require("./lib/simple")
  let Command = fs.readdirSync("./cmd/").filter(v => !v.startsWith(".")).map(v => require(`./cmd/${v}`))

  await simple(ctx)

  let user = tele.getUser(ctx.message.from)
  let { message } = ctx
  let { text, caption } = message
  text = text || caption
  if((text || "").startsWith("=>")) text = text.replace("=>", "/eval return")
  if((text || "").startsWith(">")) text = text.replace(">", "/eval")
  let is = {
    registered: !!global.db.data.users[message?.from?.id],
    group: message?.chat?.type == "supergroup",
    admin: await message?.from?.isAdmin,
    owner: ownerId.includes(message?.from?.id),
    cmd: (text || "").startsWith(prefix)
  }

  if(is.group) {
    if(!db.data.group[message.chat.id]) db.data.group[message.chat.id] = {}
    if(!db.data.group[message.chat.id].member) db.data.group[message.chat.id].member = []
    if(!db.data.group[message.chat.id].member.includes(message.from.username)) db.data.group[message.chat.id].member.push(message.from.username)
  }

  if(is.registered) {
    let user = db.data.users[message?.from?.id]

    if(!user.limit) user.limit = 50
    if(!user.lastUltah) user.lastUltah = 0

    if(user.lahir && getAge(user.lahir).isBirthday && user.lastUltah != new Date().getFullYear()) {
      await ctx.reply(`Happy birthday ${user.nama}! 🎂🎉\n\nHadiah ultah :\n+ 500.000 Uang 💰\n+ 100 Limit 🎫`)
      user.uang += 500000
      user.limit += 100
      user.lastUltah = new Date().getFullYear()
    }
  }

  // Ini buat dapatin id telegram :v
  // Id telegram dipake buat ngatur owner bot
  //console.log({ name: message.from.full_name, id: message.from.id })

  let command = ((text || "").startsWith(prefix) ? (text || "").replace(prefix, "") : (text || "")).split(" ")[0].replace("@" + bot.botInfo.username, "")
  if(is.cmd) {
    let cmd = Command.filter(v => v.help.includes(command))[0]
    if(cmd) {
      if(cmd.owner) {
        if(is.owner) {
          cmd.start(ctx, { Telegram: new Telegram(token), user, message, text: text.split(" ").slice(1).join(" "), is })
        } else {
          ctx.reply("[❌] Hanya owner bot yang dapat menggunakan perintah itu!")
        }
      } else if(cmd.group) {
        if(is.group) {
          if(cmd.admin) {
            if(is.admin) {
              cmd.start(ctx, { Telegram: new Telegram(token), user, message, text: text.split(" ").slice(1).join(" "), is })
            } else {
              ctx.reply("[❌] Hanya admin yang dapat menggunakan perintah itu!")
            }
          }
        } else {
          ctx.reply("[❌] Perintah hanya dapat digunakan di grup!")
        }
      } else if(cmd.registered) {
        if(is.registered) {
          cmd.start(ctx, { Telegram: new Telegram(token), user, message, text: text.split(" ").slice(1).join(" "), is })
        } else {
          ctx.reply("[❌] Hanya user terdaftar yang dapat menggunakan perintah itu!")
        }
      } else cmd.start(ctx, { Telegram: new Telegram(token), user, message, text: text.split(" ").slice(1).join(" "), is })
    }
  }
  if(message.pinned_message) ctx.reply("pesan yang disematkan terdeteksi")
  else logger.custom("cyan", is.cmd ? "COMMAND" : "MESSAGE", `From ${user.username ? "@" + user.username : user.full_name} to ${is.group ? message.chat.title : "Private Chat"} ${chalk.cyan(message.contact ? ((message.contact.vcard ? "👨👨" : "👨") + " " + (message.contact.first_name + (message.contact.last_name || ""))) : message.sticker ? (message.sticker.emoji + " " + message.sticker.set_name) : message.document ? ("📄 " + message.document.file_name + " (" + message.document.mime_type + ")") : message.location ? (message.location.latitude + ", " + message.location.longitude) : message.poll ? ("[poll_" + message.poll.type + "] " + message.poll.id) : message.audio ? ("🎵 " + message.audio.file_name + " (" + parseSeconds(message.audio.duration) + ")") : message.voice ? ("🎤 " + parseSeconds(message.voice.duration)) : message.video_note ? ("[video_note] " + parseSeconds(message.video_note.duration)) : (text || caption || ""))}`)
})

bot.on("deleted", console.log)
bot.on("poll", (ctx) => console.log("Poll update", ctx.poll))
bot.on("poll_answer", (ctx) => console.log("Poll answer", ctx.pollAnswer))

bot.launch().catch((err) => {
  if(err.response.error_code == 404) return logger.ERROR("Cannot use tokens! Maybe the token is corrupt or invalid")
  throw err
})
bot.telegram.getMe().then((result) => {
  let itsPrefix = (prefix != "") ? prefix : "No Prefix"
  console.log(chalk.cyanBright(" " + "=".repeat(52)))
  console.log(chalk.cyanBright(" │ + Owner    : " + owner))
  console.log(chalk.cyanBright(" │ + Bot Name : " + result.first_name))
  console.log(chalk.cyanBright(" │ + Version  : " + version.join(".")))
  console.log(chalk.cyanBright(" │ + Host     : " + os.hostname()))
  console.log(chalk.cyanBright(" │ + Platfrom : " + os.platform()))
  console.log(chalk.cyanBright(" │ + Prefix   : " + itsPrefix))
  console.log(chalk.cyanBright(" " + "=".repeat(52)))
  console.log("\n\n\n")
})

process.once("SIGINT", async function() {
  await db.save()
  bot.stop("SIGINT")
  process.exit()
})
process.once("SIGTERM", async function() {
  await db.save()
  bot.stop("SIGTERM")
  process.exit()
})
