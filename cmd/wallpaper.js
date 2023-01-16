module.exports = {
  start: async function(ctx, { text }) {
    if(!text) return ctx.reply("Penggunaan: /wallq kueri")

    let res = await fetch(`https://wall.alphacoders.com/api2.0/get.php=3e7756c85df54b78f934a284c11abe4e?method=search&search=${text}`)
    let json = await res.json()
    if(json.total_match == 0) return ctx.reply(`Tidak dapat menemukan \"${text}\"!`)

    let img = json.wallpapers[Math.floor(Math.random() * json.wallpapers.length)]
    await ctx.replyWithPhoto(img.url_image, {
      caption: "Source: https://wall.alphacoders.com/"
    })
  },
  tags: "searching",
  help: ["wallq"],
  desc: "Mencari wallpaper dari alphacode dengan teks"
}
