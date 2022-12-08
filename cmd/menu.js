module.exports = {
  start: async function(ctx, { Telegram }) {
    let { prefix } = require("../config.json")
    let { clockString } = require("../lib/function")
    let fs = require("fs")
    let Command = fs.readdirSync("./cmd/").filter(v => !v.startsWith(".")).map(v => require(`./${v}`))

    function addZero(n) {
      return String(n).padStart(2, "0")
    }

    let date = new Date()
    let YYYY = date.getFullYear()
    let MM = date.getMonth() + 1
    let DD = date.getDate()
    let hh = date.getHours()
    let mm = date.getMinutes()
    let ss = date.getSeconds()
    let hari = "Minggu Senin Selasa Rabu Kamis Jum\'at Sabtu".split(" ")[date.getDay()]

    MM = addZero(MM)
    DD = addZero(DD)
    hh = addZero(hh)
    mm = addZero(mm)
    ss = addZero(ss)

    let waktu = ""
    if(hh >= 6 && hh < 12) waktu = "pagi"
    else if(hh >= 12 && hh < 15) waktu = "siang"
    else if(hh >= 15 && hh < 18) waktu = "sore"
    else if((hh >= 18 || hh >= 0) && (hh < 6 || hh > 6)) waktu = "malam"

    let uptime = clockString(process.uptime() * 1000)


    function upperFirst(str) {
      return str[0].toUpperCase() + str.replace(str[0], "")
    }

    function getCmd() {
      let result = ""
      let last = ""
      let OneTags = [...new Set(Command.map(v => v.tags))].sort()
      for(let Tags of OneTags) {
        let list = Command.filter(v => v.tags == Tags)
        result += `├──「 ${Tags} 」\n`
        result += "│\n"
        for(let { help } of list) {
          result += (help.map(v => "├❏ /" + v + "\n").join(""))
        }
        result += "│\n"
      }
      return result.trim()
    }

    let str = `╭───「 📖 Help 」 ​​​​
│
│
├❏ Selamat ${waktu} ${user.username ? "@" + user.username : user.name}!
├❏ ${hari}, ${YYYY}-${MM}-${DD}, ${hh}:${mm}:${ss}
│
│
│
├❏ Nama : ${user.name ? user.name : user.full_name}
├❏ Prefix : ${prefix}
├❏ Uptime : ${uptime}
│
│
│
${getCmd()}
│
│
╰───「 ${(await Telegram.getMe()).first_name} 」`

    ctx.reply(str, {
      reply_markup: {
        inline_keyboard: [[{ text: "👥 Owner", callback_data: "owner" }], [{ text: "📱 Medsos", callback_data: "medsos" }], [{ text: "💰 Donasi", callback_data: "donate" }]]
      }
    })
  },
  tags: "main",
  help: ["help", "menu"],
  desc: "Menampilkan menu bot"
}
