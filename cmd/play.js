module.exports = {
  start: async function(ctx, { Telegram, user, message, text, is }) {
    if(!text) return ctx.reply("Cara penggunaan : /play Judul lagu\n\nContoh penggunaan : /play Hanya Rindu")
    await ctx.reply("⏳| Silahkan tunggu")
    let { parseSeconds } = require("../lib/function")
    let { Markup } = require("telegraf")
    let yts = require("yt-search")

    let res = (await yts(text)).all.find(v => v.type == "video" && v.seconds <= 630)
    let markup = Markup.inlineKeyboard([
      Markup.button.callback("Audio", "yta " + res.url),
      Markup.button.callback("Cancel", "c"),
      Markup.button.callback("Video", "ytv " + res.url)
    ])
    ctx.replyWithPhoto(res.thumbnail, {
      "caption": `🎵Title : ${res.title}\n🕒Upload date : ${res.ago}\n👀Viewer : ${res.views}\n⌛Duration : ${parseSeconds(res.seconds)}\n📄Description : ${res.description}`,
      ...markup
    })
  },
  tags: "downloader",
  help: ["play"],
  desc: "Play audio/video from youtube"
}
