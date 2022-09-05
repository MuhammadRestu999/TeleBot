module.exports = async function(ctx) {
  const { Telegram } = require("telegraf")
  let telegram = new Telegram(require("../config.json").token)
  ctx.reply = async function(text, opts) {
    return await telegram.sendMessage(ctx.chat.id, text, { reply_to_message_id: ctx.message.message_id, ...(opts) })
  }

  ctx.parseMention = function(ctx) {
    let text = ctx.message.text
    let mention = ctx.message.entities.filter(v => v.type == "mention")

    let result = []

    for(let i of mention) result.push(text.substr(i.offset, i.length))

    return result
  }

  if(ctx?.message?.chat?.type == "supergroup") {
    ctx.message.from = {
      ...ctx.message.from,
      get isAdmin() {
        return new Promise(async function(r) {
          r((await tele.getAdmin(ctx.chat.id)).some(v => v.id == ctx.from.id))
        })
      }
    }
  }
}
