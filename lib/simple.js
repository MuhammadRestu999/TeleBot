module.exports = async function(ctx) {
  const { Telegram } = require("telegraf")
  let telegram = new Telegram(require("../config.json").token)
  ctx.reply = async function(text, opts) {
    try {
      return await telegram.sendMessage(ctx.chat.id, text, { reply_to_message_id: (ctx.message || ctx.update.edited_message).message_id, ...(opts) })
    } catch(err) {
      console.log(err)
    }
  }

  ctx.parseMention = function() {
    let text = (ctx.message || ctx.update.edited_message).text
    let mention = ((ctx.message || ctx.update.edited_message).entities || []).filter(v => v.type == "mention")

    let result = []

    for(let i of mention) result.push(text.substr(i.offset, i.length))

    return result
  }

  if((ctx?.message || ctx?.update.edited_message)?.chat?.type?.includes?.("supergroup")) {
    (ctx.message || ctx.update.edited_message).from = {
      ...(ctx.message || ctx.update.edited_message).from,
      get isAdmin() {
        return new Promise(async function(r) {
          r((await tele.getAdmin(ctx.chat.id)).some(v => v.id == ctx.from.id))
        })
      }
    }
  }
}
