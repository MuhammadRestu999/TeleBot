module.exports = {
  start: async function(ctx, { user }) {
    let levelling = require("../lib/levelling")
    let users = global.db.data.users[user.id]
    let before = user.level

    if(!levelling.canLevelUp(users.level, users.exp, 39)) {
      let { min, max } = levelling.xpRange(users.level, users.exp, 39)
      return await ctx.replyWithMarkdown(`
Level *${users.level} (${users.exp}/${max})*
Kurang *${min} XP* lagi!
`.trim())
    }
    while(levelling.canLevelUp(users.level, users.exp, 39)) users.level++
    await ctx.replyWithMarkdown(`
Selamat, anda telah naik level!
*${before}* -> *${users.level}*
  `.trim())
  },
  registered: true,
  tags: "rpg",
  help: ["levelup", "uplevel", "naiklevel"],
  desc: "Menaikan level"
}
