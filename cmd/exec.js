module.exports = {
  start: async function(ctx, { Telegram, user, message, text, is }) {
    if(text == "/exec") text = "echo \"workas\""
    text = text.replace("/exec ", "")
    let util = require("util")
    let { exec } = require("child_process")
    let result
    exec(text, function(err, stdout, stderr) {
      if(err) result = err
      if(stdout) result = stdout
      if(stderr) result = stderr
      ctx.reply(util.format(result))
    })
  },
  owner: true,
  tags: "owner",
  help: ["exec"],
  desc: "Menjalankan kode Bash"
}
