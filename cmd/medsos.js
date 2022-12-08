module.exports = {
  start: async function(ctx) {
    let Restu = [{ type: "Telegram", value: "https://t.me/MuhammadRestu" }, { type: "Facebook", value: "https://m.facebook.com/mohamad.restu.71" }, { type: "Instagram", value: "https://www.instagram.com/_muhammad.restu_" }]

    let list = [Restu]

    let str = "Medsos owner\n\nRestu => "
    if(list.length == 1) {
      let index = 0
      for(let i of list[0]) {
        str += `[${i.type}](${i.value})${index != list[0].length - 1 ? " || " : ""}`
        index += 1
      }
    }

    ctx.replyWithMarkdown(str, { disable_web_page_preview: true })
  },
  tags: "main",
  help: ["medsos"],
  desc: "Menampilkan media sosial owner"
}
