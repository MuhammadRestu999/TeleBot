module.exports = {
  start: async function(ctx, { text }) {
    try {
      let users = global.db.data.users[user.id]
      let Aku = Math.floor(Math.random() * 91)
      let Kamu = Math.floor(Math.random() * 101)
      let count = text
      count = count ? /all/i.test(count) ? users.uang : text : 1
      count = Math.max(1, count)
      if(!text) return ctx.reply("Penggunaan : /judi jumlah\nContoh : /judi 1000")
      if(users.uang >= count * 1) {
        users.uang -= count * 1
        if(Aku > Kamu) {
          ctx.replyWithMarkdown(`aku roll:${Aku}\nKamu roll: ${Kamu}\n\nkamu *Kalah*, kamu kehilangan ${count} Money`)
        } else if(Aku < Kamu) {
          users.uang += count * 2
          ctx.replyWithMarkdown(`aku roll:${Aku}\nKamu roll: ${Kamu}\n\nkamu *Menang*, kamu Mendapatkan ${count * 2} Money`)
        } else {
          users.uang += count * 1
          ctx.replyWithMarkdown(`aku roll:${Aku}\nKamu roll: ${Kamu}\n\nkamu *Seri*, kamu Mendapatkan ${count * 1} Money`)
        }
      } else ctx.replyWithMarkdown(`uang kamu tidak cukup untuk melakukan judi sebesar ${count} Money`)
    } catch(e) {
      console.log(e)
      ctx.reply("Error!!")
    }
    function pickRandom(list) {
      return list[Math.floor(Math.random() * list.length)]
    }
  },
  registered: true,
  tags: "money",
  help: ["judi"],
  desc: "Judi"
}
