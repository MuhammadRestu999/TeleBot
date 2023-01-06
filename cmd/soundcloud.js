const { scdl } = require("../lib/scrape.js")

module.exports = {
  start: async function(ctx, { text }) {
    let args = text.split(" ")
    if(!args[0]) return ctx.reply("masukkan link")

    const res = await scdl(args[0])
    const { thumb, link, title} = res
    ctx.replyWithPhoto(thumb, { caption: `Judul: ${title}\n\nSedang mengirim audio...` }).then(function(msg) {
      ctx.replyWithAudio(link, { filename: title + ".mp3" }, { reply_to_message_id: msg.message_id })
    })
  },
  tags: "downloader",
  help: ["scdl", "soundcloud"],
  desc: "download audio from SoundCloud"
}
