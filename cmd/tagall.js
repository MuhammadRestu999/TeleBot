module.exports = {
  start: async function(ctx, { text }) {
    let mem = global.db.data.group[ctx.chat.id].member.filter(v => !!v)
    ctx.reply(text + "\n\n" + mem.map(v => "@" + v).join(" "))
  },
  admin: true,
  group: true,
  tags: "admin",
  help: ["tagall"],
  desc: "Tag semua member"
}
