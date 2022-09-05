module.exports = {
  start: async function(ctx, { Telegram, user, message, text, is }) {
    if(!text) text = "echo \"workas\""
    let util = require("util")
    let { exec } = require("child_process")
    exec(text, function(err, stdout, stderr) {
      if(err) ctx.reply(err)
      if(stdout) ctx.reply(stdout)
      if(stderr) ctx.reply(stderr)
    })
  },
  owner: true,
  tags: "owner",
  help: ["exec"],
  desc: "Menjalankan kode Bash"
}
