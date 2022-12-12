const { qna } = require("../lib/openai.js")
module.exports = {
  start: async function(ctx, { text }) {
let res = await qna(text)
ctx.reply(res)
  },
  tags: "downloader",
  help: ["ai"],
  desc: "Openai Cari Sesuatu dengan lebih mudah"
}
