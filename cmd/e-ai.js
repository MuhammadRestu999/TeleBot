const { qna } = require("../lib/openai.js")

module.exports = {
  start: async function(ctx, { text }) {
    if(!text) return ctx.reply("Apa yg ingin dicari")

    let res = await qna(text)
    await ctx.reply(res)
  },
  tags: "edukasi",
  help: ["ai"],
  desc: "Openai Cari Sesuatu dengan lebih mudah"
}
