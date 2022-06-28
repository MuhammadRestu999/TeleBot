module.exports = {
  start: async function(ctx, { Telegram, user, message, text, is }) {
    let { ownerId } = require("../config.json")
    let owner = []
    for(let i of ownerId) {
      let res = await Telegram.getChat(i)
      owner.push({ name: (res.first_name.toLowerCase() != "muhammad" ? res.first_name : res.last_name), username: res.username })
    }
    let str = "List owner :\n\n"
    for(let i in owner) str += `${String(i + 1).padStart(owner.length, "0")}. [${owner[i].name}](https://t.me/${owner[i].username})`
    ctx.replyWithMarkdown(str, { disable_web_page_preview: true })
  },
  tags: "main",
  help: ["owner"],
  desc: "Menampilkan list owner"
}
