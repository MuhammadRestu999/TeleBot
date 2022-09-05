const axios = require("axios")
const cheerio = require("cheerio")


function tiktok(url, hd = false) {
  return new Promise(async function(resolve, reject) {
    axios.post("https://api.tikmate.app/api/lookup?url=" + url).then(function({ data }) {
      let { author_avatar, author_id, author_name, comment_count, create_time, id, like_count, share_count, token } = data
      let dl = `https://tikmate.app/download/${token}/${id}.mp4${hd ? "?hd=1" : ""}`
      resolve({ result: dl, author_avatar, author_id, author_name, comment_count, create_time, like_count, share_count })
    }).catch(({data})=>resolve(data))
  })
}


module.exports = {
  tiktok
}
