module.exports = {
  start: async function(ctx, { user, text }) {
    if(global.db.data.users[user.id]?.sn) return ctx.reply("Anda sudah terdaftar!")

    let [nama, lahir] = text.split("|")
    if(!nama || !lahir || new Date(lahir) == "Invalid Date" || (Date.now() - new Date(lahir)) < (1000*60*60*24*30*12*5)) return ctx.reply(`Contoh :\n${message.text.split(" ")[0]} Restu|2008-11-08`)

    let crypto = require("crypto")
    let { getAge } = require("../lib/function")

    let sn = crypto.createHash("md5").update(String(user.id)).digest("hex")
    global.db.data.users[user.id] = {
      sn,
      nama,
      lahir,
      tanggal: Date.now(),
      uang: 0,
      bank: 0,
      exp: 0,
      level: 0
    }

    await ctx.replyWithMarkdown(`\`\`\`Sukses!\n\nNama : ${nama}\nLahir: ${lahir}\nUmur : ${getAge(lahir).age}\nSN   : ${sn}\n\`\`\``)
  },
  tags: "main",
  help: ["daftar", "register"],
  desc: "Mendaftar ke bot"
}
