module.exports = {
  start: async function(ctx, { Telegram }) {
    let { ownerPhone, ownerId } = require("../config.json")
    let res = await Telegram.getChat(ownerId)
    let owner = {
      name: (res.first_name.toLowerCase() != "muhammad" ? res.first_name : res.last_name),
      phone: ownerPhone
    }
    await ctx.replyWithContact(owner.phone, owner.name)
  },
  tags: "main",
  help: ["owner"],
  desc: "Menampilkan list owner"
}
