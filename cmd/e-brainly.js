const { Brainly } = require("brainly-scraper-v2");
const util = require("util")
module.exports = {
  start: async function(ctx, { text }) {
    if(!text) return ctx.reply("Cara penggunaan : /braily soal\n\nContoh penggunaan : /brainly Apa itu atom?")
    await ctx.reply("⏳| Silahkan tunggu")

const brain = new Brainly("id"); // 'id' - Default to 'id'


let res = await brain.searchWithMT("Apa yang dimaksud Dengan Atom", "id")
let teks = res.map((v, i) => `PENCARIAN SOAL DARI\n\nSOAl (${i})\n${v.question.content}\nJawaban: ${util.format(v.answers))}`).join("\n\n—————————————————\n\n")

ctx.reply(teks)
},
tags: "edukasi",
  help: ["brainly", "br"],
  desc: "cari soal brainly"
}
