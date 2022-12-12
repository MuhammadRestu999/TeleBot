const { Configuration, OpenAIApi } = require("openai")

module.exports = {
  start: async function(ctx, { text }) {
if (!text) return ctx.reply("Apa yg ingin dicari")

async function dalle(text) {
  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createImage({
    prompt: text,
    n: 1,
    size: "1024x1024",
  });
  return response.data.data[0].url
}

let res = await dalle(text)
await ctx.replyWithPhoto({ url: res, caption: `Asep🤖 Selesai Membuatkan Gambar Yg Anda inginkan!` })
  },
  tags: "searching",
  help: ["dalle"],
  desc: "Openai Membuat gambar foto dari text dengan lebih mudah"
}
