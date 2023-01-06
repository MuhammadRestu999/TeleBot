const { Configuration, OpenAIApi } = require("openai")

async function qna(txt) {
  const configuration = new Configuration({
    apiKey: apikeyAi
  })
  const openai = new OpenAIApi(configuration)
  let text = `Q: ${txt}
A: `
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: text,
    temperature: 0.9,
    max_tokens: 800,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop: ["A:"]
  })
  return await response.data.choices[0].text
}

async function dalle(text) {
  const configuration = new Configuration({
    apiKey: apikeyAi
  })
  const openai = new OpenAIApi(configuration)
  const response = await openai.createImage({
    prompt: text,
    n: 1,
    size: "1024x1024"
  })
  return response.data.data[0].url
}

module.exports = {
  qna,
  dalle
}
