module.exports = {
  start: async function(ctx, { user }) {
    if(!("lastMining" in global.db.data.users[user.id])) global.db.data.users[user.id].lastMining = 0
    function MeNit(ms) {
      let m = isNaN(ms) ? "02" : Math.floor(ms / 60000) % 60
      return [m].map(v => v.toString().padStart(2, 0)).join(":")
    }
    function DeTik(ms) {
      let s = isNaN(ms) ? "60" : Math.floor(ms / 1000) % 60
      return [s].map(v => v.toString().padStart(2, 0)).join(":")
    }
    function addZ(n) {
      n = Number(n)
      if(n >= 10) return n
      if(n <= 9) return "0" + n
    }
    let { random, formatMoney, clockString } = require("../lib/function")

    let cdm = MeNit(new Date - global.db.data.users[user.id].lastMining)
    let cds = DeTik(new Date - global.db.data.users[user.id].lastMining)
    let cd1 = Math.ceil(01 - cdm)
    let cd2 = Math.ceil(60 - cds)
    let timers = `00:${addZ(cd1)}:${addZ(cd2)}`

    if(Date.now() - global.db.data.users[user.id].lastMining < 120000) return ctx.replyWithHTML(`Silahkan tunggu <b>🕒${timers}</b> lagi untuk mining`)

    let uang = random(500, 1000)
    let exp = random(200, 400)

    await ctx.replyWithHTML(`Kamu mendapatkan <b>${formatMoney("IDR", uang)}</b> dan <b>${exp}</b> exp!`)
    global.db.data.users[user.id].uang += uang
    global.db.data.users[user.id].exp += exp
    global.db.data.users[user.id].lastMining = Date.now()
  },
  registered: true,
  tags: "money",
  help: ["mining"],
  desc: "Mining"
}
