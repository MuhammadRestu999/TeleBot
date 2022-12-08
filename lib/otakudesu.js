/*
  Do not delete this comment!
  Created by :
    https://github.com/MuhammadRestu999
    https://api.whatsapp.com/send?phone=6285783417029
    muhammadrestu490@gmail.com
*/

let axios = require("axios")
let cheerio = require("cheerio")
let https = require("https")
let jsdom = require("jsdom")
let { JSDOM } = jsdom

let virtualConsole = new jsdom.VirtualConsole()
virtualConsole.on("error", () => {}) // Ignore "Could not parse CSS stylesheet" error
                                     // https://stackoverflow.com/a/69958999
let agent = new https.Agent({
  rejectUnauthorized: false
})                                   // Ignore "Uncaught AxiosError: certificate has expired"
                                     // https://stackoverflow.com/a/62212128

class InvalidArguments extends TypeError {
  constructor(message) {
    super(message)
    this.name = "InvalidArguments"
  }
}
const isString = s => typeof s === "string"
const isNumber = n => typeof n === "number"
const isBoolean = b => typeof b === "boolean"

async function search(title) {
  if(!title) throw new Error("Enter the anime title!")
  if(!isString(title)) throw new InvalidArguments(`The "title" argument must be of type string. Received ${typeof title}`)

  let { data } = await axios.get(`https://otakudesu.bid/?s=${encodeURIComponent(title)}&post_type=anime`)
  let $ = cheerio.load(data)
  let result = []

  let li = $("div.page > ul.chivsrc > li")
  li.each(function(i) {
    let html = $(li[i]).html()
    let obj = {}
    let _$ = cheerio.load(html)
    obj.thumbnail = _$("img.attachment-post-thumbnail").attr("src")
    obj.title = _$("h2 > a").text()
    obj.url = _$("h2 > a").attr("href")
    obj.id = obj.url.split("/").at(-2)

    let { document } = new JSDOM(html).window

    let genre = []
    document.querySelectorAll("div.set")[0].querySelectorAll("a").forEach(function(v) {
      genre.push({ name: v.innerHTML, url: v.getAttribute("href") })
    })
    obj.genre = genre
    obj.status = document.querySelectorAll("div.set")[1].innerHTML.split(": ")[1]
    obj.rating = Number(document.querySelectorAll("div.set")[2].innerHTML.split(": ")[1])

    result.push(obj)
  })
  return result
}

async function get(id) {
  if(!isString(id)) throw new InvalidArguments(`The "id" argument must be of type string. Received ${typeof id}`)

  let { data, request } = await axios(`https://otakudesu.bid/anime/${id}`)
  if(request.res.responseUrl == "https://otakudesu.bid/") throw new Error("Anime not found!")

  let $ = cheerio.load(data)
  let { document } = new JSDOM(data, { virtualConsole }).window
  let result = {}

  result.thumb = $("img.attachment-post-thumbnail").attr("src")
  result.info = {
    judul: document.querySelectorAll("div.infozingle > p > span")[0].innerHTML.split(": ")[1],
    judul_jepang: document.querySelectorAll("div.infozingle > p > span")[1].innerHTML.split(": ")[1],
    skor: document.querySelectorAll("div.infozingle > p > span")[2].innerHTML.split(": ")[1],
    produser: document.querySelectorAll("div.infozingle > p > span")[3].innerHTML.split(": ")[1].split(", "),
    episode: document.querySelectorAll("div.infozingle > p > span")[6].innerHTML.split(": ")[1],
    tanggal_rilis: document.querySelectorAll("div.infozingle > p > span")[8].innerHTML.split(": ")[1],
    studio: document.querySelectorAll("div.infozingle > p > span")[9].innerHTML.split(": ")[1],
    genre: document.querySelectorAll("div.infozingle > p > span")[10].innerHTML.split(": ")[1].split(", ").map(v => v.split(">")[1].split("<")[0])
  }
  result.sinopsis = $("div.sinopc").text()
  result.episode = []
  document.querySelectorAll("div.episodelist > ul > li").forEach(function(v) {
    let obj = {}
    let _$ = cheerio.load(v.innerHTML)
    obj.episode = _$("span > a").text()
    obj.url = _$("span > a").attr("href")
    obj.id = obj.url.split("/").at(-2)
    result.episode.push(obj)
  })
  result.episode.reverse()

  return result
}

async function stream(id) {
  if(!isString(id)) throw new InvalidArguments(`The "id" argument must be of type string. Received ${typeof id}`)

  let { data, request } = await axios({
    url: `https://otakudesu.bid/episode/${id}`,
    headers: {
      "User-Agent": "Mozilla/5.0 (Linux; Android 11; RMX2189) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36"
    }
  })
  if(request.res.responseUrl == "https://otakudesu.bid/") throw new Error("Episode not found!")

  let $ = cheerio.load(data)
  let iframe = $("div.responsive-embed-stream > iframe").attr("src")

  return iframe
}

async function download(id, batch = false) {
  if(!isString(id)) throw new InvalidArguments(`The "id" argument must be of type string. Received ${typeof id}`)
  if(!isBoolean(batch)) throw new InvalidArguments(`The "batch" argument must be of type boolean. Received ${typeof batch}`)

  let { data, request } = await axios(`https://otakudesu.bid/${batch ? "batch/" : "episode/"}${id}`)
  if(request.res.responseUrl == "https://otakudesu.bid/") throw new Error("Episode not found!")

  let $ = cheerio.load(data)

  let selector = !batch ? "div.venutama > div.download > ul > li" : "div.download2 > div.batchlink > ul > li"

  let list = $(selector)
  let result = []
  for(let v of list) {
    let _$ = cheerio.load(v)
    let tmp = {}
    tmp.quality = _$("strong").text()
    tmp.size = _$("i").text()
    tmp.url = {}
    for(let v of _$("a")) {
      try {
        let _$ = cheerio.load(v)
        let url = (await axios.get(_$("a").attr("href"), { httpsAgent: agent }))?.request?._redirectable?._currentUrl || ""
        let type = _$("a").text()
        tmp.url[type] = url
      } catch(e) {
        if(e instanceof axios.AxiosError && e?.response?.status == 404) continue
        throw e
      }
    }
    result.push(tmp)
  }

  return result
}

async function schedule() {
  let { data } = await axios("https://otakudesu.bid/jadwal-rilis/")
  let $ = cheerio.load(data)
  let result = []
  let element = $(".kgjdwl321")
  element.find(".kglist321").each(function() {
    let day = $(this).find("h2").text()

    if(day == "Random") return

    let animeList = []
    $(this).find("ul > li").each(function() {
      let animeName = $(this).find("a").text()
      let link = $(this).find("a").attr("href")
      let id = link.replace("https://otakudesu.bid/anime/", "")
      animeList.push({ animeName, id, link })
    })
    result.push({ day, animeList })
  })

  return result
}

async function ongoingAnime(page) {
  if(!isNumber(page) && page != undefined) throw new InvalidArguments(`The "page" argument must be of type number. Received ${typeof page}`)

  let url = "https://otakudesu.bid/ongoing-anime/"
  if(!isNaN(page) && page > 1) url += "page/" + page + "/"

  let { data } = await axios(url)
  let $ = cheerio.load(data)

  let result = []

  let selector = $("div.rapi > div.venz > ul > li")
  selector.each(function() {
    let title = $(this).find("div.detpost > div.thumb > a > div.thumbz > h2").text()
    let thumb = $(this).find("div.detpost > div.thumb > a > div.thumbz > img").attr("src")
    let eps = $(this).find("div.detpost > div.epz").text().trim().split(" ")[1] * 1
    let day = $(this).find("div.detpost > div.epztipe").text().trim()
    let date = $(this).find("div.detpost > div.newnime").text().trim()
    let link = $(this).find("div.detpost > div.thumb > a").attr("href")

    result.push({ title, thumb, eps, day, date, link })
  })

  return result
}

async function genre(q, page) {
  if(!isString(q) && q != undefined) throw new InvalidArguments(`The "q" argument must be of type string. Received ${typeof q}`)
  if(!isNumber(page) && page != undefined) throw new InvalidArguments(`The "page" argument must be of type number. Received ${typeof page}`)

  if(!q) return await genreList()
  let { data, request } = await axios("https://otakudesu.bid/genres/" + q + ((page && page > 1) ? "/page/" + page : ""))
  if(request.res.responseUrl == "https://otakudesu.bid/") throw new Error("Genre or page not found!")
  let $ = cheerio.load(data)

  let result = []

  $("div.col-anime").each(function() {
    let obj = {}
    obj.pic = $(this).find("div.col-anime-cover > img").attr("src")
    obj.title = $(this).find("div.col-anime-title > a").text()
    obj.link = $(this).find("div.col-anime-title > a").attr("href")
    obj.studio = $(this).find("div.col-anime-studio").text().split(", ")
    obj.eps = $(this).find("div.col-anime-eps").text()
    obj.rating = $(this).find("div.col-anime-rating").text()
    obj.genre = $(this).find("div.col-anime-genre").text().split(", ")
    obj.synopsis = $(this).find("div.col-synopsis").text()

    result.push(obj)
  })

  return result
}

async function genreList() {
  let { data } = await axios("https://otakudesu.bid/genre-list/")
  let $ = cheerio.load(data)

  let result = []

  $("div.venser > ul.genres > li > a").each(function() {
    let name = $(this).text()
    let link = "https://otakudesu.bid" + $(this).attr("href")

    result.push({ name, link })
  })

  return result
}

let exprt = {
  search,
  get,
  stream,
  download,
  schedule,
  ongoingAnime,
  genre,
  genreList
}

module.exports = exprt
