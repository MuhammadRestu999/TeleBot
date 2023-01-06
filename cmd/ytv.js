const { youtubedl, youtubedlv2, youtubedlv3 } = require("@bochilteam/scraper")

module.exports = {
  start: async function(ctx, { text }) {
    let { servers, ytv, ytIdRegex  } = require("../lib/y2mate")
    let args = text.split(" ")
    let server = "id4"

    if(!args[0]) return ctx.reply("Masukkan url!")
    if(!ytIdRegex.test(args[0])) return ctx.reply("Masukkan url YouTube yang valid!")

    const limit = 100
    const { thumbnail, video: _video, title } = await youtubedl(args[0]).catch(async _ => await youtubedlv2(args[0])).catch(async _ => await youtubedlv3(args[0]))
    const limitedSize = (limit ? 99 : limit) * 1024
    let video, source, res, link, lastError, isLimit
    for(let i in _video) {
      try {
        video = _video[i]
        if(isNaN(video.fileSize)) continue

        isLimit = limitedSize < video.fileSize
        if(isLimit) continue

        link = await video.download()
        if(link) res = await fetch(link)

        isLimit = res?.headers.get("content-length") && parseInt(res.headers.get("content-length")) < limitedSize
        if(isLimit) continue
        if(res) source = await res.arrayBuffer()
        if(source instanceof ArrayBuffer) break
      } catch (e) {
        video = source = link = null
        lastError = e
      }
    }
    if((!(source instanceof ArrayBuffer) || !link || !res.ok) && !isLimit) return await ctx.reply("Can\"t download video")

    ctx.replyWithPhoto(thumbnail, { caption: `Ukuran file: ${video.fileSizeH}\nJudul: ${title}\n\nSedang mengirim video...` }).then(function(msg) {
      ctx.replyWithVideo({ url: link}, { filename: title + ".mp4" }, { reply_to_message_id: msg.message_id })
    })
  },
  tags: "downloader",
  help: ["ytv", "ytmp4"],
  desc: "Mengunduh video YouTube"
}
