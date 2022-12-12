const { savefrom } = require("../lib/scrape.js")
module.exports = {
  start: async function(ctx, { text }) {
    if (!text) return ctx.reply("Contoh penggunaan: /fb https://facebook.com")
    let res = ( await savefrom(m.text)).url[0]
    let result = await savefrom(text)
   
   let { title, source, duration } = result.meta
   let { url } = res
await ctx.reply("⏳| Sedang Diproses...").then(function(msg) {
   ctx.replyWithVideo({ url: url, caption: `${title ? "*Title:* "+ title : "Untitled"}
${duration ? "*Duration:* " + duration : "null"}
`, filename: title + ".mp4" }, { reply_to_message_id: msg.message_id })
})
},
  tags: "downloader",
  help: ["tt", "tiktok", "ttdl", "tiktokdl", "savefrom", "fb", "facebook", "twitter"],
  desc: "Mengunduh video dari mana saja"
}
