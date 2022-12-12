const { youtubedl, youtubedlv2, youtubedlv3, youtubeSearch } = require("@bochilteam/scraper")

module.exports = {
  start: async function(ctx, { text }) {
    if(!text) return ctx.reply("Cara penggunaan : /play Judul lagu\n\nContoh penggunaan : /play Hanya Rindu")
    await ctx.reply("⏳| Silahkan tunggu")
    let vid = (await youtubeSearch(text)).video[0]
  if (!vid) return ctx.reply('Video/Audio Tidak ditemukan')
  let { title, description, videoId, durationH, viewH, publishedTime } = vid
  const url = 'https://www.youtube.com/watch?v=' + videoId
  const { thumbnail } = await youtubedl(url).catch(async _ => await youtubedlv2(url)).catch(async _ => await youtubedlv3(url))

    //let res = (await yts(text)).all.find(v => v.type == "video" && v.seconds <= 630)
    let markup = Markup.inlineKeyboard([
      Markup.button.callback("Audio", "yta " + url),
      Markup.button.callback("Cancel", "c"),
      Markup.button.callback("Video", "ytv " + url)
    ])
    ctx.replyWithPhoto(thumbnail, {
      "caption": `🎵Title : ${title}\n🕒Upload date : ${publishedTime}\n👀Viewer : ${viewH}\n⌛Duration : ${durationH}\n📄Description : ${description}`,
      ...markup
    })
  },
  tags: "downloader",
  help: ["play"],
  desc: "Play audio/video from youtube"
}
