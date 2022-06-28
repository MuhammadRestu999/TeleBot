const chalk = require("chalk")
function color(warna = "white", teks = "Hello world") {
  return chalk[warna] ? chalk[warna](teks) : chalk.keyword(warna)(teks)
}


module.exports.logger = {
  INFO: function(text) {
    console.log(color("cyan", "[ INFO ]"), text)
  },
  WARN: function(text) {
    console.log(color("cyan", "[ WARN ]"), color("yellow", text))
  },
  ERROR: function(text) {
    console.log(color("cyan", "[ ERROR ]"), color("red", text))
  },
  custom: function(color, name, text) {
    if(!color) color = "cyan"
    console.log(chalk[color]("[ " + name + " ]"), text)
  }
}

module.exports.clockString = (ms) => {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  console.log({ms,h,m,s})
  return [h, m, s].map(v => v.toString().padStart(2, 0) ).join(":")
}

module.exports.parseSeconds = (s) => {
  let h = Math.floor(s / 3600)
  let m = Math.floor(s / 60) % 60
  s = Math.floor(s) % 60
  console.log({ h, m, s })
  return [h, m, s].map(v => String(v).padStart(2, "0")).join(":")
}
