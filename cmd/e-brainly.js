const { Brainly } = require("brainly-scraper-v2")

module.exports = {
  start: async function(ctx, { text }) {
    if(!text) return ctx.reply("Cara penggunaan : /braily soal\n\nContoh penggunaan : /brainly Apa itu atom?")
    await ctx.reply("⏳| Silahkan tunggu")
try {
    const brain = new Brainly("id")
    const res = await brain.searchWithMT(text, "id")
    const teks = `=======[ 🧠Brainly Searching🔍 ]=======

🔍Pencarian Soal Dari 
<b>${res[0].question.content}</b>

<b>📜Jawaban:</b>
${res[0].answers.sort((a, b) => b.thanksCount - a.thanksCount)[0].content.trim()}
`.trim()

    await ctx.replyWithHTML(teks)
} catch(e) {
ctx.reply("Expired session/Eror code")
}
  },
  tags: "edukasi",
  help: ["brainly", "br"],
  desc: "cari soal brainly"
}
