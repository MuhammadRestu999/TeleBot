module.exports = {
  start: async function(ctx) {
    let str = `
<pre>╭─「 Donasi • Pulsa 」
│ • Telkom : </pre><pre>082328303332</pre>
<pre>╰────

╭─「 Donasi • Non Pulsa 」
│ • Dana    : </pre><pre>082328303332</pre><pre>
│ • Gopay   : </pre><pre>None</pre><pre>
│ • OVO     : </pre><pre>082328303332</pre><pre>
│ • Saweria : </pre><a href="https://saweria.co/Sxzy">https://saweria.co/Sxzy</a><pre>
╰────</pre>
`.trim()
    ctx.replyWithHTML(str, { disable_web_page_preview: true })
  },
  tags: "main",
  help: ["donasi", "donate"],
  desc: "Untuk mendukung owner bot :3"
}
