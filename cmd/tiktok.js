module.exports = {
  start: async function(ctx, { Telegram, user, message, text, is }) {
    await ctx.reply("⏳| Silahkan tunggu")
    const addZero = n => (n+"").padStart(2, "0")
    let { tiktok } = require("../lib/scrape")
    let ttr = /(@[a-zA-z0-9\_]*|.*)(\/.*\/|trending.?shareId=)([\d]*)/gm
    let args = text.split(" ")
    if(!args[0]) return ctx.reply("Masukkan URL!").catch(console.log)
    if(!ttr.test(args[0])) return ctx.reply("Tautan tidak valid!")
    let url = args[0]
    let hd = args[1] == "hd" || args[1] == "HD"
    let result = await tiktok(url)
    if(!result?.result) return ctx.reply("Error!")
    await ctx.replyWithMarkdown(`[@${result.author_id}](https://tiktok.com/@${result.author_id}) (${result.author_name})\n\nDisukai ${addZero(result.like_count)} kali\nKomentar ${addZero(result.comment_count)} kali\nDibagikan ${addZero(result.share_count)} kali\n\n\nSedang mengirim video...`)
    ctx.replyWithVideo({ url: result.result }, { reply_to_message_id: ctx.update.message.message_id }).catch(function(err) {
      ctx.reply(`Error!\n\n${err.message}`)
      ctx.reply(`Download sendiri videonya\n\n${result.result}`)
    })
  },
  tags: "downloader",
  help: ["tt", "tiktok", "ttdl", "tiktokdl"],
  desc: "Mengunduh video dari tiktok"
}


