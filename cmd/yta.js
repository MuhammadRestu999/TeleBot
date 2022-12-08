module.exports = {
  start: async function(ctx, { text }) {
    let args = text.split(" ")
    let { servers, yta, ytIdRegex  } = require("../lib/y2mate")
    let server = "id4"

    if(!args[0]) return ctx.reply("Masukkan url!")
    if(!ytIdRegex.test(args[0])) return ctx.reply("Masukkan url YouTube yang valid!")
    let { dl_link, thumb, title, filesize, filesizeF } = await yta(args[0], server)
    ctx.replyWithPhoto(thumb, { caption: `Ukuran file: ${filesizeF}\nJudul: ${title}\n\nSedang mengirim audio...` }).then(function(msg) {
      ctx.replyWithAudio({ url: dl_link, filename: title + ".mp3" }, { reply_to_message_id: msg.message_id })
    })
  },
  tags: "downloader",
  help: ["yta", "ytmp3"],
  desc: "Mengunduh dan mengkonversi video YouTube menjadi audio"
}
