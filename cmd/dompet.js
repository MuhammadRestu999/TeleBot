module.exports = {
  start: async function(ctx, { user, is }) {
    let { getAge, formatMoney } = require("../lib/function")
    let levelling = require("../lib/levelling")
    let isOwner = is.owner
    let data = global.db.data.users[user.id]
    let { lahir, limit, uang, exp, level, registered } = data
    uang = uang == Infinity ? "Infinite" : formatMoney("IDR", uang)
    let { min, max } = levelling.xpRange(level, 39)
    let jumlah = Object.keys(global.db.data.users).length
    let nama = user.full_name
    let id = user.id

    let str = `┌──「 DOMPET 」──
│
├ Nama : <b>${nama}</b>
├ Id : <b>${id}</b>
├ Lahir : <b>${lahir}</b>
├ Umur : <b>${getAge(lahir).age}</b>
├ Limit : <b>${limit}</b>
├ Uang : <b>${uang}</b>
├ Level : <b>${level}</b>
├ Exp : <b>${exp} / ${max}</b>
├ User Terdaftar : ${jumlah} User(s)
├ Owner : ${btul(isOwner)}
├ Terdaftar : ✓
│
└──「 ${bot.botInfo.username} 」──`

    await ctx.replyWithHTML(str)

    function btul(tof) {
      return tof ? "✓" : "×"
    }
  },
  registered: true,
  tags: "money",
  help: ["dompet"],
  desc: "Melihat dompet"
}
