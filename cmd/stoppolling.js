module.exports = {
  start: async function(ctx, { Telegram, text }) {
    if(!text) return await ctx.reply("Mana IDnya?")
    if(!global.db.data.group[ctx.message.chat.id].polls[text]) return await ctx.reply("ID Tidak ditemukan!")
    if(global.db.data.group[ctx.message.chat.id].polls[text] != ctx.from.id) return await ctx.reply("Bukan kamu yang menciptakan polling")

    let info = await Telegram.stopPoll(ctx.chat.id, text)
    delete global.db.data.group[ctx.message.chat.id].polls[text]
    await ctx.reply(`
====================
${info.question}
====================
${info.options.map(v => "Nama: " + v.text + "\nPemilih: " + v.voter_count).join("\n\n")}
====================
`.trim())
  },
  admin: true,
  group: true,
  tags: "group",
  help: ["stoppolling", "stoppoll"],
  desc: "Menghentikan polling"
}
