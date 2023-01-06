module.exports = {
  start: async function(ctx) {
    let str = `
<pre>╭─「 Donasi • Pulsa 」
│ • Im3 : </pre><pre>085783417029</pre>
<pre>╰────

╭─「 Donasi • Non Pulsa 」
│ • Dana    : </pre><pre>085783417029</pre><pre>
│ • Gopay   : </pre><pre>None</pre><pre>
│ • OVO     : </pre><pre>085783417029</pre><pre>
│ • Saweria : </pre><a href="https://saweria.co/MuhammadRestu">https://saweria.co/MuhammadRestu</a><pre>
╰────</pre>
`.trim()
    ctx.replyWithHTML(str, { disable_web_page_preview: true })
  },
  tags: "main",
  help: ["donasi", "donate"],
  desc: "Untuk mendukung owner bot :3"
}
