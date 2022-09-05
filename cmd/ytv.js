module.exports = {
  start: async function(ctx, { Telegram, user, message, text, is }) {
    let args = text.split(" ")
    let { servers, ytv, ytIdRegex  } = require("../lib/y2mate")
    let server = "id4"

    if(!args[0]) return ctx.reply("Masukkan url!")
    if(!ytIdRegex.test(args[0])) return ctx.reply("Masukkan url YouTube yang valid!")
    let { dl_link, thumb, title, filesize, filesizeF } = await ytv(args[0], server)
    ctx.replyWithPhoto(thumb, { caption: `Ukuran file: ${filesizeF}\nJudul: ${title}\n\nSedang mengirim video...` }).then(function(msg) {
      ctx.replyWithVideo({ url: dl_link }, { reply_to_message_id: msg.message_id })
    })
  },
  tags: "downloader",
  help: ["ytv", "ytmp4"],
  desc: "Mengunduh video YouTube"
}
