const { dalle } = require("../lib/openai.js")

module.exports = {
  start: async function(ctx, { text }) {
    if(!text) return ctx.reply("Apa yg ingin dicari")

    let res = await dalle(text)
    await ctx.replyWithPhoto({ url: res, caption: "Berhasil menciptakan gambar!" })
  },
  tags: "searching",
  help: ["dalle"],
  desc: "Openai Membuat gambar foto dari text dengan lebih mudah"
}
