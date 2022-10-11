module.exports = {
  start: async function(ctx, { Telegram, user, message, text, is }) {
    await ctx.reply("⏳| Silahkan tunggu")
    let util = require("util")
    try {
      let result = util.format(await eval(`(async() => { ${text};\n })()`))
      await ctx.reply(result || "**No Result**")
    } catch(err) {
      try {
        await ctx.reply(err.stack)
      } catch {
        await ctx.reply(err.message)
      }
    }
  },
  owner: true,
  tags: "owner",
  help: ["eval"],
  desc: "Menjalankan kode javascript"
}
