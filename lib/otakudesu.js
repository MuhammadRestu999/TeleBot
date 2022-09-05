let axios = require("axios")
let cheerio = require("cheerio")
let jsdom = require("jsdom")
let { JSDOM } = jsdom

let virtualConsole = new jsdom.VirtualConsole()
virtualConsole.on("error", () => {}) // Abaikan error "Could not parse CSS stylesheet"
// https://stackoverflow.com/a/69958999

async function search(title) {
  if(!title) throw new Error("Enter the anime title!")

  let { data } = await axios.get(`https://otakudesu.watch/?s=${encodeURIComponent(title)}&post_type=anime`)
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

async function get(url) {
  if(!url.startsWith("https://otakudesu.watch/anime/")) throw new Error("Wrong URL!")
  let { data, request } = await axios(url)
  if(request.res.responseUrl == "https://otakudesu.watch/") throw new Error("Anime not found!")

  let $ = cheerio.load(data)
  let { document } = new JSDOM(data, { virtualConsole }).window
  let result = {}

  result.thumb = $("img.attachment-post-thumbnail").attr("src")
  result.info = {
    judul: document.querySelectorAll("div.infozingle > p > span")[0].innerHTML.split(": ")[1],
    judul_tepang: document.querySelectorAll("div.infozingle > p > span")[1].innerHTML.split(": ")[1],
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

async function download(url) {
  if(!(url.startsWith("https://otakudesu.watch/episode/") || url.startsWith("https://otakudesu.watch/batch/"))) throw new Error("Wrong URL!")
  let { data } = await axios(url)
  let $ = cheerio.load(data)

  let isEps = url.includes("/episode/")
  let isBatch = url.includes("/batch/")

  let selector = isEps ? "div.venutama > div.download > ul > li" : "div.download2 > div.batchlink > ul > li"

  let list = $(selector)
  let result = []
  list.each(function(_, v) {
    let _$ = cheerio.load(v)
    let tmp = {}
    tmp.quality = _$("strong").text()
    tmp.size = _$("i").text()
    tmp.url = {}
    _$("a").each(function(_, v) {
      let _$ = cheerio.load(v)
      let url = _$("a").attr("href")
      let type = _$("a").text()
      tmp.url[type] = url
    })
    result.push(tmp)
  })

  return result
}

async function schedule() {
  let { data } = await axios("https://otakudesu.watch/jadwal-rilis/")
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
      let id = link.replace("https://otakudesu.watch/anime/", "")
      animeList.push({ animeName, id, link })
    })
    result.push({ day, animeList })
  })

  return result
}

async function ongoingAnime(page) {
  page = page*1
  let url = "https://otakudesu.watch/ongoing-anime/"
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
  if(!q) return await genreList()
  let { data, request } = await axios("https://otakudesu.watch/genres/" + q + ((page && page > 1) ? "/page/" + page : ""))
  if(request.res.responseUrl == "https://otakudesu.watch/") throw new Error("Genre or page not found!")
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
  let { data } = await axios("https://otakudesu.watch/genre-list/")
  let $ = cheerio.load(data)

  let result = []

  $("div.venser > ul.genres > li > a").each(function() {
    let name = $(this).text()
    let link = "https://otakudesu.watch" + $(this).attr("href")

    result.push({ name, link })
  })

  return result
}

module.exports = {
  search,
  get,
  download,
  schedule,
  ongoingAnime,
  genre,
  genreList
}
