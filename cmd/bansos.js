module.exports = {
  start: async function(ctx, { user }) {
    if(!("lastBansos" in global.db.data.users[user.id])) global.db.data.users[user.id].lastBansos = 0
    const { clockString } = require("../lib/function")
    let Bot = Math.floor(Math.random() * 96)
    let User = Math.floor(Math.random() * 101)
    let kalah = fs.readFileSync("./src/kbansos.jpg")
    let menang = fs.readFileSync("./src/mbansos.jpg")
    let __timers = Date.now() - global.db.data.users[user.id].lastBansos
    let _timers = 300000 - __timers
    let timers = clockString(_timers)

    if(__timers < 300000) return ctx.reply(`Kamu sudah Melakukan Korupsi bansos, dan kamu harus menunggu selama ${timers} agar bisa korupsi bansos kembali`)
    if(Bot > User) {
      await ctx.replyWithPhoto({
        source: kalah
      }, {
        caption: "Kamu tertangkap setelah kamu korupsi dana bansos 🕴️💰,  dan kamu harus membayar denda 3 juta rupiah 💵"
      })
      global.db.data.users[user.id].uang -= 3000000
    } else if(User > Bot) {
      await ctx.replyWithPhoto({
        source: menang
      }, {
        caption: "Kamu berhasil korupsi dana bansos 🕴️💰,  dan kamu mendapatkan 3 juta rupiah💵"
      })
      global.db.data.users[user.id].uang += 3000000
    } else await ctx.replyWithMarkdown("Sorry gan lu ga berhasil korupsi bansos dan tidak masuk penjara karna kamu *melarikan diri 🏃*")

    global.db.data.users[user.id].lastBansos = Date.now()
  },
  registered: true,
  tags: "money",
  help: ["bansos"],
  desc: "Korupsi bansos"
}
