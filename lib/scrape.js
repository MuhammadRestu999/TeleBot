const axios = require("axios")
const cheerio = require("cheerio")
const vm = require("node:vm")
const { Spotify } = require("spotifydl-core")
const spotify = new Spotify({
  clientId: "acc6302297e040aeb6e4ac1fbdfd62c3",
  clientSecret: "0e8439a1280a43aba9a5bc0a16f3f009"
})


function tiktok(url, hd = false) {
  return new Promise(async function(resolve, reject) {
    axios.post("https://api.tikmate.app/api/lookup?url=" + url).then(function({ data }) {
      let { author_avatar, author_id, author_name, comment_count, create_time, id, like_count, share_count, token } = data
      let dl = `https://tikmate.app/download/${token}/${id}.mp4${hd ? "?hd=1" : ""}`
      resolve({ result: dl, author_avatar, author_id, author_name, comment_count, create_time, like_count, share_count })
    }).catch(reject)
  })
}

async function scdl(url) {
  return new Promise(async (resolve, reject) => {
    await axios.request({
      url: "https://www.klickaud.co/download.php",
      method: "POST",
      data: new URLSearchParams(Object.entries({"value": url, "afae4540b697beca72538dccafd46ea2ce84bec29b359a83751f62fc662d908a" : "2106439ef3318091a603bfb1623e0774a6db38ca6579dae63bcbb57253d2199e"})),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "user-agent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36"
      }
    }).then(res => {
      const $ = cheerio.load(res.data)
      const result = {
        link: $("#dlMP3").attr("onclick").split(`downloadFile("`)[1].split(`",`)[0],
        thumb: $("#header > div > div > div.col-lg-8 > div > table > tbody > tr > td:nth-child(1) > img").attr("src"),
        title: $("#header > div > div > div.col-lg-8 > div > table > tbody > tr > td:nth-child(2)").text()

      }
      resolve(result)
    }).catch(reject)
})
}
async function savefrom() {
  let body = new URLSearchParams({
    sf_url: encodeURI(arguments[0]),
    sf_submit: "",
    new: 2,
    lang: "id",
    app: "",
    country: "id",
    os: "Windows",
    browser: "Chrome",
    channel: " main",
    "sf-nomad": 1
  });
  let {
    data
  } = await axios({
    url: "https://worker.sf-tools.com/savefrom.php",
    method: "POST",
    data: body,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      origin: "https://id.savefrom.net",
      referer: "https://id.savefrom.net/",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36"
    }
  });
  let exec = '[]["filter"]["constructor"](b).call(a);';
  data = data.replace(exec, `\ntry {\ni++;\nif (i === 2) scriptResult = ${exec.split(".call")[0]}.toString();\nelse (\n${exec.replace(/;/, "")}\n);\n} catch {}`);
  let context = {
    scriptResult: "",
    i: 0
  };
  vm.createContext(context);
  new vm.Script(data).runInContext(context);
  return JSON.parse(context.scriptResult.split("window.parent.sf.videoResult.show(")?.[1].split(");")?.[0])
}

async function gempa() {
  let { data } = await axios.get("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json")

  let img = await (await fetch("https://data.bmkg.go.id/DataMKG/TEWS/" + data.Infogempa.gempa.Shakemap)).buffer()
  let result = {
    creator: "Restu",
    source: "BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)",
    result: {
      img
    }
  }

  for(let i in data.Infogempa.gempa) {
    if(i == "Shakemap") continue
    result.result[i.toLowerCase()] = data.Infogempa.gempa[i]
  }

  return result
}

async function spdl(url) {
  let kp = await spotify.getTrack(url)
  let kp2 = await spotify.downloadTrack(url)
  let res = {
    creator: "Follow IG: rizxyux",
    judul: kp.name,
    artis: kp.artists,
    album: kp.album_name,
    rilis: kp.release_date,
    thumb: kp.cover_url,
    audio: kp2
  }
  return res
}

async function jarak(dari, ke) {
  let url = `https://www.google.com/search?q=${encodeURIComponent("jarak " + dari + " ke " + ke)}&hl=id`
  let { data } = await axios(url)
  let $ = cheerio.load(data)
  let img = data.split("var s=\'")[1].split("\'")[0]
  let res = {
   result: {
    img: /^data:.*?\/.*?;base64,/i.test(img) ? Buffer.from(img.split`,`[1], "base64") : "",
    desc: $("div.BNeawe.deIvCb.AP7Wnd").text()
    }
  }
  return res
}

module.exports = {
  tiktok,
  scdl,
  savefrom,
  gempa,
  spdl,
  jarak
}
