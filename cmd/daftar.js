module.exports = {
  start: async function(ctx, { message, user, text }) {
    if(global.db.data.users[user.id]?.sn) return ctx.reply("Anda sudah terdaftar!")

    let [nama, lahir] = text.split("|")
    if(!nama || !lahir || new Date(lahir) == "Invalid Date" || (Date.now() - new Date(lahir)) < (1000*60*60*24*30*12*5)) return ctx.reply(`Contoh :\n${message.text.split(" ")[0]} Restu|2008-11-08`)

    let crypto = require("crypto")
    let { getAge } = require("../lib/function")

    let sn = crypto.createHash("md5").update(String(user.id)).digest("hex")
    global.db.data.users[user.id] = {
      sn,
      nama,
      lahir,
      tanggal: Date.now(),
      uang: 0,
      bank: 0,
      exp: 0,
      level: 0,
      levelbag: 1,
      health: 100,
      strength: 8,
      mp: 30,
      agility: 5,
      durability: 8,
      intelligence: 5,
      sword: 0,
      swordexp: 0,
      armor: 0,
      armorexp: 0,
      pickaxe: 0,
      pickaxeexp: 0,
      busur: 0,
      busurexp: 0,
      magicwand: 0,
      magicwandexp: 0,
      items: {
      panah: 0,
      enchantbook: 0,
      potion: 0,
      tali: 0,
      string: 0,
      besi: 0,
      zamrud: 0,
      emas: 0,
      batu: 0,
      kayu: 0,
      elixir: 0,
      ether: 0,
      antidote: 0,
    },
      maxitems: 100,
      lastrevive: 0,
      lastenchant: 0
    }

    await ctx.replyWithMarkdown(`\`\`\`Sukses!\n\nNama : ${nama}\nLahir: ${lahir}\nUmur : ${getAge(lahir).age}\nSN   : ${sn}\n\`\`\``)
  },
  tags: "main",
  help: ["daftar", "register"],
  desc: "Mendaftar ke bot"
}
