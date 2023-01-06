const { savefrom } = require("../lib/scrape.js")
module.exports = {
  start: async function(ctx, { text }) {
    if(!text) return ctx.reply("Contoh penggunaan: /fb https://facebook.com")

    let res = ( await savefrom(text)).url[0]
    let result = await savefrom(text)
    let { title, source, duration } = result.meta
    let { url } = res

    await ctx.reply("⏳| Sedang Diproses...").then(function(msg) {
      ctx.replyWithVideo({
        url,
        caption: `
*Title*: ${title || "Untitled"}
*Duration*:  ${duration || "00:00:00"}
`.trim(),
        filename: (title || "untitled") + ".mp4"
      }, { reply_to_message_id: msg.message_id })
    })
  },
  tags: "downloader",
  help: ["tt", "tiktok", "ttdl", "tiktokdl", "savefrom", "fb", "facebook", "twitter"],
  desc: "Mengunduh video dari mana saja"
}
