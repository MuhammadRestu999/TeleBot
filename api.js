const { Telegram } = require("telegraf")
const fs = require("fs")
const { token } = JSON.parse(fs.readFileSync(__dirname + "/config.json"))

const telegram = new Telegram(token)

async function sendMsg(id, txt, opt) {
  return await telegram.sendMessage(id, txt, opt)
}


module.exports = {
  sendMsg
}
