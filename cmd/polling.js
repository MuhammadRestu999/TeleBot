module.exports = {
  start: async function(ctx, { text }) {
    if(!text) return await ctx.reply("Penggunaan :\n/polling <judul>|<pilihan ganda>|<...konten>\n\nContoh :\n/polling Ini contoh|off|Nomor 1|Nomor 2|Nomor 3")

    let [judul, multipile, ...konten] = text.split("|")
    if(!judul) return await ctx.reply("Mana judulnya?")
    if(multipile.toLowerCase() != "on" && multipile.toLowerCase() != "off") konten = [multipile, ...konten]

    if(konten.length < 2) return await ctx.reply("Minimal 2 pilihan")
    if(konten.length > 10) return await ctx.reply("Maksimal 10 pilihan")

    let poll = await ctx.replyWithPoll(judul, konten, {
      is_anonymous: false,
      allows_multiple_answers: multipile.toLowerCase() == "on",
      reply_to_message_id: ctx.message.message_id
    })

    global.db.data.group[ctx.message.chat.id].polls[poll.message_id] = ctx.from.id
    await ctx.reply(`Berhasil menciptakan polling\n\nID Polling : ${poll.message_id}`)
  },
  admin: true,
  group: true,
  tags: "group",
  help: ["polling", "poll"],
  desc: "Mengirim polling"
}
