module.exports = {
  start: async function(ctx, { Telegram, text }) {
    if(!text) return await ctx.reply("Anu\nTextnya mana?")

    let chats_id = Object.keys(global.db.data.users).concat(Object.keys(global.db.data.group))
    let success = 0
    let error = 0
    let err = []

    for(let id of chats_id) {
      try {
        await Telegram.sendMessage(id, "¸,ø¤º°`°º¤ø,¸ [ Broadcast ] ¸,ø¤º°`°º¤ø,¸\n\n\n" + text)
        success++
      } catch {
        error++
        err.push(id)
      }
    }

    await ctx.reply(`Sukses mengirim broadcast ke ${success} chat${error ? "\ndan gagal mengirim broadcast ke " + error + " chat" : ""}`)
    console.log(err)
  },
  owner: true,
  tags: "owner",
  help: ["broadcast", "bc"],
  desc: "Mengirim broadcast"
}
