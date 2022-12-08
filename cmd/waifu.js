module.exports = {
  start: async function(ctx) {
    let markup = Markup.inlineKeyboard([
      Markup.button.callback("Next", "wnext"),
      Markup.button.callback("Delete", "d")
    ])
    let { data } = await axios("https://waifu.pics/api/sfw/waifu")
    ctx.replyWithPhoto(data.url, {
      "caption": `Source: ${data.url}`,
      ...markup
    })
  },
  tags: "anime",
  help: ["waifu"],
  desc: "Mengirim foto waifu random"
}
