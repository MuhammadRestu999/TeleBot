module.exports = function(ctx) {
  const { Telegram } = require("telegraf")
  let telegram = new Telegram(require("../config.json").token)
  ctx.reply = async function(text, opts) {
    return await telegram.sendMessage(ctx.message.chat.id, text, { reply_to_message_id: ctx.message.message_id, ...(opts) })
  }
}
