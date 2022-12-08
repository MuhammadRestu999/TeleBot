module.exports = {
  start: async function(ctx, { text }) {
    let user = global.db.data.users[ctx.from.id]
    if(user.ref_code) return await ctx.reply(`Kamu sudah memiliki kode referral!
https://t.me/MuhammadRestu_bot?start=${user.ref_code}`)

    user.ref_code = new Array(16).fill().map(v => [..."0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"][crypto.randomInt(64)]).join("")
    user.ref_count = 0

    await ctx.reply(`Kode referral telah dibuat
Bagikan tautan ini agar Anda mendapatkan bonus uang & limit bot
https://t.me/MuhammadRestu_bot?start=${user.ref_code}`)
  },
  registered: true,
  tags: "main",
  help: ["referral"],
  desc: "Kode referral"
}
