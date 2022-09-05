module.exports = {
  start: async function(ctx, { Telegram, user, message, text, is }) {
    let levelling = require("../lib/levelling")
    let users = global.db.data.users[user.id]
    if(!levelling.canLevelUp(users.level, users.exp, 39)) {
      let { min, max } = levelling.xpRange(users.level, users.exp, 39)
      return ctx.replyWithMarkdown(`
Level *${users.level} (${users.exp}/${max})*
Kurang *${min} XP* lagi!
`.trim())
    }
    users.level++
    ctx.replyWithMarkdown(`
Selamat, anda telah naik level!
*${users.level - 1}* -> *${users.level}*
  `.trim())
  },
  registered: true,
  tags: "rpg",
  help: ["levelup", "uplevel", "naiklevel"],
  desc: "Menaikan level"
}
