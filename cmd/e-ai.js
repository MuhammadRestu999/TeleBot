const { Configuration, OpenAIApi } = require("openai")

module.exports = {
  start: async function(ctx, { text }) {
if (!text) return ctx.reply("Apa yg ingin dicari")

async function qna(txt) {
  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);
  let text = `Q: ${txt}
A:`
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: text,
    temperature: 0.9,
    max_tokens: 800,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop: ["A:"],
  });
  return await response.data.choices[0].text
}

let res = await qna(text)
await ctx.reply(res)
  },
  tags: "searching", "edukasi",
  help: ["ai"],
  desc: "Openai Cari Sesuatu dengan lebih mudah"
}
