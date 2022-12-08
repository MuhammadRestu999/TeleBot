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
  let d = Math.floor(ms / 86400000)
  let h = Math.floor(ms / 3600000) % 24
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  console.log({ms,h,m,s, d})
  return (""+d).padStart(2, "0") + ", " + [h, m, s].map(v => v.toString().padStart(2, 0)).join(":")
}

module.exports.parseSeconds = (s) => {
  let h = Math.floor(s / 3600)
  let m = Math.floor(s / 60) % 60
  s = Math.floor(s) % 60
  console.log({ h, m, s })
  return [h, m, s].map(v => String(v).padStart(2, "0")).join(":")
}

module.exports.sleep = (ms) => new Promise(r => setTimeout(r, ms))

module.exports.getAge = function(ymd) {
  let now = new Date()
  let year = now.getFullYear()
  let month = now.getMonth() + 1
  let day = now.getDate()

  let born = new Date(ymd)
  let yyyy = born.getFullYear()
  let mm = born.getMonth() + 1
  let dd = born.getDate()

  if(born == "Invalid Date") return {
    error: true,
    message: born
  }
  if(born > now) return {
    error: true,
    message: "Invalid Date"
  }

  let age = month >= mm && day >= dd ? year - yyyy : mm < month ? year - yyyy : year - yyyy - 1
  let next = month >= mm && day >= dd ? [year + 1, mm, dd].map(v => (""+v).padStart(2, "0")).join("-") : mm < month ? [year + 1, mm, dd].map(v => (""+v).padStart(2, "0")).join("-") : [year, mm, dd].map(v => (""+v).padStart(2, "0")).join("-")
  let isBirthday = month == mm && day == dd

  return {
    age,
    next,
    isBirthday
  }
}

module.exports.random = function(min = 1, max = 100) {
  if(!min || isNaN(min) || min < 1) min = 1
  if(!max || isNaN(max) || max < 0) max = min = 100
  if(max < min) max = min + 10

  let result = 0
  while(result < min) {
    result = Math.floor(Math.random() * (max + 1))
  }

  return result
}

module.exports.formatMoney = function(currency = "IDR", amount = 1000) {
  return amount.toLocaleString("id", {
    style: "currency",
    currency
  }).split(",")[0]
}

module.exports.toMp4 = function(buffer, url) {
  if(!buffer && !url) return false

  return new Promise(async function(resolve, reject) {
    if(!buffer && url) buffer = await (await fetch(url)).buffer()
    let tmp1 = "./tmp/" + Date.now() + ".gif"
    let tmp2 = "./tmp/" + Date.now() + ".mp4"
    fs.writeFileSync(tmp1, buffer)

    exec(`ffmpeg -i "${tmp1}" -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" "${tmp2}"`, function(err) {
      if(err) return reject(err)
      let result = fs.readFileSync(tmp2)
      if(!result) return reject(false)

      resolve(result)
    })
  })
}
