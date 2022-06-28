module.exports = {
  start: async function(ctx, { Telegram, user, message, text, is }) {
    if(text == "/eval") text = "return undefined"
    text = text.replace("/eval ", "")
    let util = require("util")
    let result
    try {
      await eval(`(async() => { ${text}; })()`).then(res => result = util.format(res))
    } catch(err) {
      result = err.stack
    } finally {
      result = util.format(result)
      try {
        ctx.reply(result)
      } catch(err) {
        ctx.reply(err.message)
      }
    }
  },
  owner: true,
  tags: "owner",
  help: ["eval"],
  desc: "Menjalankan kode javascript"
}
