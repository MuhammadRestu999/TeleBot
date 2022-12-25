const { Telegraf, Telegram, Markup } = require("telegraf")
const chalk = require("chalk")
const cp = require("child_process")
const ft = require("./lib/function")
const fs = require("fs")
const os = require("os")
const util = require("util")
const axios = require("axios")
const fetch = require("node-fetch")
const FormData = require("form-data")
const cheerio = require("cheerio")
const jsdom = require("jsdom")
const crypto = require("crypto")
const express = require("express")
const schedule = require("node-schedule")

const otakudesu = require("./lib/otakudesu")

const { token, owner, ownerLink, ownerId, version, prefix, apikeyAi } = JSON.parse(fs.readFileSync("./config.json"))
const { logger, clockString, parseSeconds, sleep, getAge } = ft

const app = express()
app.get("/", (req, res) => res.send("Hello world"))
app.listen(3333)

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"

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
global.crypto = crypto
global.otakudesu = otakudesu
global.express = express
global.exec = cp.exec
global.app = app
global.apikeyAi = apikeyAi
try {
  global.db = {
    data: JSON.parse(fs.readFileSync("db.json"))
  }
} catch {
  global.db = {
    data: {
      users: {},
      group: {}
    }
  }
}
db.save = function() {
  return new Promise(async(res, rej) => {
    logger.custom("cyan", "DB", "Saving database")
    await fs.cpSync("db.json", "db_backup.json")
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

schedule.scheduleJob("db", { seconds: 0 }, async function() {
  await db.save()
})

global.dfail = async function(ctx, type) {
  let fail = {
    registered: "Hanya user terdaftar yang dapat menggunakan perintah itu!",
    owner: "Hanya owner yang dapat menggunakan perintah itu!",
    group: "Perintah hanya dapat digunakan di grup!",
    admin: "Hanya admin yang dapat menggunakan perintah itu!"
  }

  return await ctx.reply(`[❌] ${fail[type] || type}`)
}

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
        try {
          require(f + file)
        } catch(err) {
          logger.ERROR(`Failed to load file ${file}`)
          console.log(err.stack)
        }
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

const isSelf = process.argv.includes("--self")

const bot = new Telegraf(token)
global.bot = bot

bot.on("new_chat_members", async(up) => {
  if(isSelf) return

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
  if(isSelf) return

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
  if(isSelf) return

  global.tele = require("./lib/tele")
  global.simple = require("./lib/simple")
  await simple(ctx)

  let telegram = new Telegram(token)
  let user = tele.getUser(ctx.message.from)
  logger.custom("cyan", "COMMAND", `From ${chalk.whiteBright(user.full_name)} cmd ${chalk.cyan(ctx.message.text)}`)

  let ref = ctx.message.text.split(" ")[1]
  if(ref) {
    let pemilik = [40000, 20] // [uang, limit]
    let pertama = [20000, 10] // [uang, limit]
    let bonus = {
       5: [1000, 10],  // [uang, limit]
      10: [2000, 20],  // [uang, limit]
      15: [3000, 30],  // [uang, limit]
      20: [4000, 40],  // [uang, limit]
      25: [5000, 50],  // [uang, limit]
      30: [6000, 60],  // [uang, limit]
      35: [7000, 70],  // [uang, limit]
      40: [8000, 80],  // [uang, limit]
      45: [9000, 90],  // [uang, limit]
      50: [10000, 100] // [uang, limit]
    }
    let users = Object.entries(global.db.data.users)
    if(ref && !users.some(([_, v]) => v.ref_code == ref)) return await ctx.reply(`Kode referral "${ref}" tidak ditemukan!`)
    let ref_owner = users.find(([_, v]) => v.ref_code == ref)[1]
    let ref_owner_id = users.find(([_, v]) => v.ref_code == ref)[0]

    if(ctx.message.from.id == ref_owner_id) return await ctx.reply("Mana bisa gitu")

    if(!global.db.data.users[ctx.message.from.id]) global.db.data.users[ctx.message.from.id] = {
      uang: 0,
      limit: 0
    }

    let user = global.db.data.users[ctx.message.from.id]
    if(user.ref_used) return await ctx.reply("Kamu sudah pernah menggunakan kode referral sebelumnya!")
    if(user.ref_code) return await ctx.reply("Kamu sudah tidak dapat menggunakan kode referral!")

    user.ref_used = ref

    let dapat = {
      u: {
        uang: 0,
        limit: 0
      },
      o: {
        uang: 0,
        limit: 0
      }
    }
    user.uang += pertama[0]
    user.limit += pertama[1]
    dapat.u.uang += pertama[0]
    dapat.u.limit += pertama[1]

    ref_owner.uang += pemilik[0]
    ref_owner.limit += pemilik[1]
    dapat.o.uang += pemilik[0]
    dapat.o.limit += pemilik[1]

    if(bonus[ref_owner["ref_count"]]) {
      let bounus = bonus[ref_owner["ref_count"]]
      user.uang += pertama[0]
      user.limit += pertama[1]
      dapat.u.uang += pertama[0]
      dapat.u.limit += pertama[1]

      ref_owner.uang += pemilik[0]
      ref_owner.limit += pemilik[1]
      dapat.o.uang += pemilik[0]
      dapat.o.limit += pemilik[1]
    }

    ref_owner["ref_count"]++
    await ctx.reply(`Berhasil menggunakan kode referral "${ref}"
+ ${dapat.u.uang} Uang 💰
+ ${dapat.u.limit} Limit 🎫`)
    await telegram.sendMessage(ref_owner_id, `Seseorang menggunakan kode referral Anda!
total user yang menggunakan kode referral Anda : ${ref_owner["ref_count"]}

+ ${dapat.o.uang} Uang 💰
+ ${dapat.o.limit} Limit 🎫`)
    return !0
  }

  await ctx.replyWithMarkdown(`Hai @${user.username}!\n\nKirim /help atau /menu untuk melihat list menu\n\nBot ini dibuat oleh [${owner}](${ownerLink}).`, { disable_web_page_preview: true })
})

bot.on("callback_query", async(ctx) => {
  global.tele = require("./lib/tele")
  let Command = fs.readdirSync("./cmd/").filter(v => !v.startsWith(".")).map(v => require(`./cmd/${v}`))
  let { callbackQuery: click } = ctx
  let { from, message } = click
  let user = tele.getUser(from)

  if(click.data == "wnext") {
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
  } else if(click.data?.startsWith?.("TeleBot-ttt")) {
    const args = click.data.split(" ")
    if(!isNaN(args[1])) {
      if(!global.db.tictactoe?.[ctx.chat.id]) return await ctx.deleteMessage().catch(v => 0)
      if(global.db.tictactoe[ctx.chat.id].p1[0] != from.id && global.db.tictactoe[ctx.chat.id].p2[0] != from.id) return await ctx.answerCbQuery("You can\'t play because you are not the player!", true)
      if(global.db.tictactoe[ctx.chat.id].turn != ctx.from.id) return await ctx.answerCbQuery("Not your turn")
      global.db.tictactoe[ctx.chat.id].button.reply_markup.inline_keyboard = global.db.tictactoe[ctx.chat.id].button.reply_markup.inline_keyboard.map(a => a.map(b => ({
        text: b.text == args[1] ? (from?.id == global.db.tictactoe[ctx?.chat?.id]?.p1?.[0] ? "❌" : from?.id == global.db.tictactoe[ctx?.chat?.id]?.p2?.[0] ? "⭕" : b.text) : b.text,
        callback_data: `TeleBot-ttt ${b.text == args[1] ? (from?.id == global.db.tictactoe[ctx?.chat?.id]?.p1?.[0] ? "❌" : from?.id == global.db.tictactoe[ctx?.chat?.id]?.p2?.[0] ? "⭕" : b.text) : b.text}`
      })))
      global.db.tictactoe[ctx.chat.id].turn = global.db.tictactoe[ctx.chat.id].p1[0] == from.id ? global.db.tictactoe[ctx.chat.id].p2[0] : global.db.tictactoe[ctx.chat.id].p1[0]

      let bawah = `@${global.db.tictactoe[ctx.chat.id].p1[0] == global.db.tictactoe[ctx.chat.id].turn ? global.db.tictactoe[ctx.chat.id].p1[1] : global.db.tictactoe[ctx.chat.id].p2[1]} turn`
      let _arr = global.db.tictactoe[ctx.chat.id].button.reply_markup.inline_keyboard.map(v => [v[0].text, v[1].text, v[2].text])
      let arr = []

      for(let i of _arr)
        for(let j of i)
          arr.push(j)


      let y = [null].concat(arr)
      let x = "❌"
      let o = "⭕"
      let isWin = ((y[1] == x && y[4] == x && y[7] == x) || (y[2] == x && y[5] == x && y[8] == x) || (y[3] == x && y[6] == x && y[9] == x) || (y[1] == x && y[2] == x && y[3] == x) || (y[4] == x && y[5] == x && y[6] == x) || (y[7] == x && y[8] == x && y[9] == x) || (y[1] == x && y[5] == x && y[9] == x) || (y[3] == x && y[5] == x && y[7] == x)) || ((y[1] == o && y[4] == o && y[7] == o) || (y[2] == o && y[5] == o && y[8] == o) || (y[3] == o && y[6] == o && y[9] == o) || (y[1] == o && y[2] == o && y[3] == o) || (y[4] == o && y[5] == o && y[6] == o) || (y[7] == o && y[8] == o && y[9] == o) || (y[1] == o && y[5] == o && y[9] == o) || (y[3] == o && y[5] == o && y[7] == o))
      console.log(isWin)
      if(isWin) bawah = `The winner is @${ctx.from.username}\n\n+ 10.000 Money\n+ 3.000 Exp`

      await ctx.editMessageText(`
⟨[ TicTacToe Games ]⟩

Player 1: @${global.db.tictactoe[ctx.chat.id].p1[1]}
Player 2: @${global.db.tictactoe[ctx.chat.id].p2[1]}

${bawah}
`, global.db.tictactoe[ctx.chat.id].button)
      if(isWin) {
        global.db.data.users[ctx.from.id].money += 10_000
        global.db.data.users[ctx.from.id].exp += 3_000
        delete global.db.tictactoe[ctx.chat.id]
        return
      }
    }
  } else {
    if(click.data != "owner" && click.data != "medsos" && click.data != "donate" && click.data != "ttt") ctx.deleteMessage().catch(v => 0)
  }
  if(click.data == "ttt" && from?.id == global.db.tictactoe?.[ctx?.chat?.id]?.p1?.[0]) return await ctx.answerCbQuery("What are you doing", true)

  let is = {
    registered: !!global?.db?.data?.users?.[from?.id]?.nama,
    group: message?.chat?.type?.includes?.("group"),
    admin: await message?.from?.isAdmin,
    owner: ownerId == from?.id
  }

  let command = click.data.split(" ")[0]
  let text = click.data.split(" ")
  text.shift()
  text = text.join(" ")
  logger.custom("cyan", "CALLBACK", `From ${user.username ? "@" + user.username : user.full_name} ${chalk.cyan(click.data)}`)

  if(isSelf && !is.owner) return

  let cmd = Command.filter(v => v.help.includes(command))[0]
  if(cmd) {
    if(cmd.registered && !is.registered) return await dfail(ctx, "registered")
    if(cmd.group && !is.group) return await dfail(ctx, "group")
    if(cmd.admin && !is.admin) return await dfail(ctx, "admin")
    if(cmd.owner && !is.owner) return await dfail(ctx, "admin")

    await cmd.start(ctx, { Telegram: new Telegram(token), user, message, text, is })
  }
})

bot.on(["message", "edited_message"], async(ctx) => {
  global.tele = require("./lib/tele")
  global.simple = require("./lib/simple")
  let Command = fs.readdirSync("./cmd/").filter(v => !v.startsWith(".")).map(v => require(`./cmd/${v}`))

  await simple(ctx)
  let user = tele.getUser(ctx?.message?.from || ctx?.update.edited_message?.from)
  let { message, update: { edited_message } } = ctx
  message = message || edited_message
  let { text, caption } = message
  text = text || caption
  if((text || "").startsWith("=>")) text = text.replace("=>", "/eval return")
  if((text || "").startsWith(">")) text = text.replace(">", "/eval")
  if((text || "").startsWith("$")) text = text.replace("$", "/exec")
  let is = {
    registered: !!global.db.data.users[message?.from?.id]?.nama,
    group: message?.chat?.type == "supergroup",
    admin: await message?.from?.isAdmin,
    owner: ownerId == message?.from?.id,
    cmd: (text || "").startsWith(prefix)
  }

  if(isSelf && !is.owner) return

  if(is.group) {
    if(!db.data.group[message.chat.id]) db.data.group[message.chat.id] = {}
    if(!db.data.group[message.chat.id].member) db.data.group[message.chat.id].member = []
    if(!db.data.group[message.chat.id].member.includes(message.from.username)) db.data.group[message.chat.id].member.push(message.from.username)
    if(!db.data.group[message.chat.id].polls) db.data.group[message.chat.id].polls = {}
    if(!db.data.group[message.chat.id].quiz) db.data.group[message.chat.id].quiz = {}
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

  if(message.pinned_message) await ctx.reply("pesan yang disematkan terdeteksi")
  else logger.custom("cyan", is.cmd ? "COMMAND" : "MESSAGE", `From ${user.username ? "@" + user.username : user.full_name} to ${is.group ? message.chat.title : "Private Chat"} ${chalk.cyan(message.contact ? ((message.contact.vcard ? "👨👨" : "👨") + " " + (message.contact.first_name + (message.contact.last_name || ""))) : message.sticker ? (message.sticker.emoji + " " + message.sticker.set_name) : message.document ? ("📄 " + message.document.file_name + " (" + message.document.mime_type + ")") : message.location ? (message.location.latitude + ", " + message.location.longitude) : message.poll ? ("[poll_" + message.poll.type + "] " + message.poll.id) : message.audio ? ("🎵 " + message.audio.file_name + " (" + parseSeconds(message.audio.duration) + ")") : message.voice ? ("🎤 " + parseSeconds(message.voice.duration)) : message.video_note ? ("[video_note] " + parseSeconds(message.video_note.duration)) : (text || caption || ""))}`)

  // Ini buat dapatin id telegram :v
  // Id telegram dipake buat ngatur owner bot
  //console.log({ name: message.from.full_name, id: message.from.id })

  let command = ((text || "").startsWith(prefix) ? (text || "").replace(prefix, "") : (text || "")).split(" ")[0].replace("@" + bot.botInfo.username, "")

  if(is.cmd) {
    let cmd = Command.filter(v => v.help.includes(command))[0]
    if(!cmd) return !1

    if(cmd.registered && !is.registered) return await dfail(ctx, "registered")
    if(cmd.group && !is.group) return await dfail(ctx, "group")
    if(cmd.admin && !is.admin) return await dfail(ctx, "admin")
    if(cmd.owner && !is.owner) return await dfail(ctx, "owner")

    try {
      await cmd.start(ctx, { Telegram: new Telegram(token), user, message, text: text.split(" ").slice(1).join(" "), is })
    } catch(err) {
      await ctx.reply(err.stack)
    }
  }
})

bot.on("inline_query", async function(ctx) {
  const { query } = ctx.inlineQuery
  let res
  let result
  try {
    res = await otakudesu.search(query)
    if(res[0]) result = res
      .map(({ thumbnail, title, url, id, genre, status, rating }) => ({
        type: "article",
        id,
        title,
        cache_time: 0,
        description: `Genre : ${genre.map(v => v.name).join(", ")}\nStatus : ${status}\nScore : ${rating}`,
        thumb_url: thumbnail,
        input_message_content: {
          message_text: `
<b>Title</b>: ${title}
<b>URL</b>: <a href="${url}">${url}</a>
<b>Genre</b>: ${genre.map(v => v.name).join(", ")}
<b>Status</b>: ${status}
<b>Rating</b>: ${rating}
`,
          parse_mode: "HTML"
        },
        ...Markup.inlineKeyboard([
          Markup.button.url("🔗 Go to Otakudesu", url)
        ])
      }))
    else result = [{
      type: "article",
      id: "notfound",
      title: "Anime Not Found",
      description: `Anime ${query} not found!`,
      input_message_content: {
        message_text: `Anime ${query} not found!`
      }
    }]
  } catch(e) {
    if(e.message === "Enter the anime title!") return
    result = [{
      type: "article",
      id: "error",
      title: "Error!",
      cache_time: 0,
      description: "Click here to see the error",
      input_message_content: {
        message_text: `\`\`\`${e.stack}\`\`\``
      }
    }]
  }
  return await ctx.answerInlineQuery(result)
})

bot.launch().catch((err) => {
  if(err?.response?.error_code == 404) return logger.ERROR("Cannot use tokens! Maybe the token is corrupt or invalid")
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
  console.log("SIGINT")
  process.exit()
})
process.once("SIGTERM", async function() {
  await db.save()
  bot.stop("SIGTERM")
  console.log("SIGTERM")
  process.exit()
})
