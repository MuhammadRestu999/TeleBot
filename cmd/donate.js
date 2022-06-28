module.exports = {
  start: async function(ctx, { Telegram, user, message, text, is }) {
    let str = `
<pre>╭─「 Donasi • Pulsa 」
│ • Im3 : 085783417029
╰────

╭─「 Donasi • Non Pulsa 」
│ • Dana    : 085783417029
│ • Gopay   : 085783417029
│ • OVO     : 085783417029
│ • Saweria : https://saweria.co/MuhammadRestu
╰────</pre>
`.trim()
    ctx.replyWithHTML(str, { disable_web_page_preview: true })
  },
  tags: "main",
  help: ["donasi", "donate"],
  desc: "Untuk mendukung owner bot :3"
}
