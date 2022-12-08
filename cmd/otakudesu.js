module.exports = {
  start: async function(ctx, { text }) {
    if(!text) return await ctx.reply("Judul / ID animenya?")

    if(text.split(" ")[0] === "get") {
      const res = await otakudesu.get(text.split(" ").slice(1).join(" ")).catch(e => e.message)
      if(res === "Anime not found!") return await ctx.replyWithHTML(`Anime <b>${text.split(" ").splice(1).join(" ")}</b> not found`)

      const result = `
<b>Title</b>: ${res.info.judul}
<b>Score</b>: ${res.info.skor}
<b>Producer</b>: ${res.info.produser.join(", ")}
<b>Episode</b>: ${res.info.episode}
<b>Release date</b>: ${res.info.tanggal_rilis}
<b>Studio</b>: ${res.info.studio}
<b>Genre</b>: ${res.info.genre.join(", ")}
<b>Synopsis</b>:
`

      const msg = await ctx.replyWithHTML(result)
      await Telegram.sendMessage(ctx.chat.id, res.sinopsis || "No synopsis", {
        reply_to_message_id: msg.message_id
      })
    } else {
      const res = await otakudesu.search(text)
      const result = !res[0] ? `Anime <b>${text}</b> not found!` :  res
        .map(v => `
<b>Title</b>: ${v.title}
<b>URL</b>: ${v.url}
<b>ID</b>: ${v.id}
<b>Genre</b>: ${v.genre.map(v => v.name).join(", ")}
<b>Status</b>: ${v.status}
<b>Score</b>: ${v.rating}
`.trim())

      await ctx.replyWithHTML(result?.join?.(`\n${"-".repeat(50)}\n`) || result)
    }
  },
  tags: "anime",
  help: ["otakudesu"],
  desc: "Cari dan dapatkan info anime"
}
