const { Telegraf, Telegram } = require("telegraf")
const chalk = require("chalk")
const { logger, clockString, parseSeconds } = require("./lib/function")
const fs = require("fs")
const os = require("os")
const util = require("util")

const { token, owner, ownerLink, ownerId, version, prefix } = JSON.parse(fs.readFileSync("./config.json"))

function watch(f, callback) {
  if(!fs.existsSync(f)) return logger.ERROR(`Cannot read file or folder ${f}!`)
  logger.INFO(`Watching ${f}`)
  fs.watch(f, function(type, file) {
    if(callback) return callback()
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
watch("./lib/tele.js", () => { global.tele = require("./lib/tele") })
watch("./lib/simple.js", () => { global.simple = require("./lib/simple") })

if(token == "") return logger.ERROR("Tokens cannot be empty!")

const bot = new Telegraf(token)

bot.on("new_chat_members", async(up) => {
  global.tele = require("./lib/tele")
  let { message } = up
  let pp_gc = await tele.getPhotoProfile(message.chat.id)
  let gc = message.chat.title
  let gc_mem = await bot.telegram.getChatMembersCount(message.chat.id)
  for(let USER of message.new_chat_members) {
    let user = tele.getUser(USER)
    let pp = await tele.getPhotoProfile(user.id)
    let fname = tele.getUser(user).full_name
    logger.custom("cyan", "JOIN", chalk.whiteBright(fname) + " " + chalk.greenBright("join in") + " " + chalk.whiteBright(gc))
    up.reply(`Kon\'nichiwa ${USER.username ? "@" + USER.username : user.full_name}!`)
  }
})
bot.on("left_chat_member", async(up) => {
  global.tele = require("./lib/tele")
  let { message } = up
  let user = message.left_chat_member
  let pp_gc = await tele.getPhotoProfile(message.chat.id)
  let gc = message.chat.title
  let gc_mem = await bot.telegram.getChatMembersCount(message.chat.id)
  let pp = await tele.getPhotoProfile(user.id)
  let fname = tele.getUser(user).full_name
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
  let Command = fs.readdirSync("./cmd/").filter(v => !v.startsWith(".")).map(v => require(`./cmd/${v}`))
  let { callbackQuery: click } = ctx
  let { from, message } = click
  let user = tele.getUser(from)

  let is = {
    group: message?.chat?.type == "supergroup",
    owner: ownerId.includes(from?.id)
  }

  let command = click.data
  let cmd = Command.filter(v => v.help.includes(command))[0]
  let text = command
  if(!cmd) {
    ctx.reply("Perintah itu tidak ada!")
  } else {
    if(cmd.owner) {
      if(is.owner) {
        cmd.start(ctx, { Telegram: new Telegram(token), user, message, text, is })
      } else {
        ctx.reply("Hanya owner bot yang dapat menggunakan perintah itu!")
      }
    } else cmd.start(ctx, { Telegram: new Telegram(token), user, message, text, is })
  }
  logger.custom("cyan", "CALLBACK", `From ${user.username ? "@" + user.username : user.full_name} ${chalk.cyan(click.data)}`)
})

bot.on("message", async(ctx) => {
  global.tele = require("./lib/tele")
  global.simple = require("./lib/simple")
  let Command = fs.readdirSync("./cmd/").filter(v => !v.startsWith(".")).map(v => require(`./cmd/${v}`))

  simple(ctx)

  let user = tele.getUser(ctx.message.from)
  let { message } = ctx
  let { text, caption } = message
  let is = {
    cmd: (text || "").startsWith(prefix),
    group: message?.chat?.type == "supergroup",
    owner: ownerId.includes(message?.from?.id)
  }

  // Ini buat dapatin id telegram :v
  // Id telegram dipake buat ngatur owner bot
  //console.log({ name: message.from.full_name, id: message.from.id })

  let command = ((text || "").startsWith(prefix) ? (text || "").replace(prefix, "") : (text || "")).split(" ")[0].replace("@" + bot.botInfo.username, "")
  if(is.cmd) {
    let cmd = Command.filter(v => v.help.includes(command))[0]
    if(!cmd) {
      ctx.reply("Perintah itu tidak ada!")
    } else {
      if(cmd.owner) {
        if(is.owner) {
          cmd.start(ctx, { Telegram: new Telegram(token), user, message, text, is })
        } else {
          ctx.reply("Hanya owner bot yang dapat menggunakan perintah itu!")
        }
      } else cmd.start(ctx, { Telegram: new Telegram(token), user, message, text, is })
    }
  }
  if(message.pinned_message) ctx.reply("pesan yang disematkan terdeteksi")
  else logger.custom("cyan", is.cmd ? "COMMAND" : "MESSAGE", `From ${user.username ? "@" + user.username : user.full_name} to ${is.group ? message.chat.title : "Private Chat"} ${chalk.cyan(message.contact ? ((message.contact.vcard ? "👨👨" : "👨") + " " + (message.contact.first_name + (message.contact.last_name || ""))) : message.sticker ? (message.sticker.emoji + " " + message.sticker.set_name) : message.document ? ("📄 " + message.document.file_name + " (" + message.document.mime_type + ")") : message.location ? (message.location.latitude + ", " + message.location.longitude) : message.poll ? ("[poll_" + message.poll.type + "] " + message.poll.id) : message.audio ? ("🎵 " + message.audio.file_name + " (" + parseSeconds(message.audio.duration) + ")") : message.voice ? ("🎤 " + parseSeconds(message.voice.duration)) : message.video_note ? ("[video_note] " + parseSeconds(message.video_note.duration)) : (text || caption || ""))}`)
})


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



process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))
