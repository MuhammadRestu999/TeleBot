module.exports = {
  start: async function(ctx, {text}) {
    let markup = Markup.inlineKeyboard([
      Markup.button.callback("Next", "wnext"),
      Markup.button.callback("Delete", "d")
    ])
    let res = await fetch('https://wall.alphacoders.com/api2.0', '/get.php', {
      auth: '3e7756c85df54b78f934a284c11abe4e',
      method: 'search',
      term: text
    })
if (!res.ok) return await res.text()
    let json = await res.json()
    if(json.total_match == 0) return ctx.reply(`Tidak dapat menemukan \"${text}\"!`)
let img = json.wallpapers[Math.floor(Math.random() * json.wallpapers.length)]
ctx.replyWithPhoto(img, {
      "caption": `Source: https://wall.alphacoders.com/`,
      ...markup
    })
  },
  tags: "searching",
  help: ["wallq"],
  desc: "Mencari wallpaper dari alphacode dengan teks"
}
