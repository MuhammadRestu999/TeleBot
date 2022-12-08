module.exports = {
  start: async function(ctx, { Telegram }) {
    let fs = require("fs")
    let Command = fs.readdirSync("./cmd/").filter(v => !v.startsWith(".")).map(v => require(`./${v}`))
    let arr = []
    for(let i of Command) {
      if(i.help[1]) {
        for(let j of i.help) arr.push({ command: j, description: i.desc })
      } else arr.push({ command: i.help[0], description: i.desc })
    }
    let now = await Telegram.getMyCommands()
    if(now.length == arr.length && now.every((v, i) => arr[i].command == v.command && arr[i].description == v.description)) return await ctx.reply("Sudah terbaru")

    let res = false
    try {
      res = await Telegram.setMyCommands(arr)
    } catch(err) {
      console.error(err)
      res = false
    }
    if(res) ctx.reply("Sukses")
    else ctx.reply("Gagal!")
  },
  owner: true,
  tags: "owner",
  help: ["updatemenu"],
  desc: "Mengupdate menu bot"
}
