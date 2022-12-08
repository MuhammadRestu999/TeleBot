const { Telegraf } = require("telegraf")
const config = require("../config.json")
const bots = new Telegraf(config.token)

exports.getArgs = async(ctx) => {
  try {
    args = (ctx.message || ctx.edited_message).text
    args = args.split(" ")
    args.shift()
    return args
  } catch { return [] }
}

exports.getUser = (ctx) => {
  try {
    user = ctx
    last_name = user["last_name"] || ""
    full_name = user.first_name + " " + last_name
    name = full_name.split(" ")[0].toLowerCase() == "muhammad" ? full_name.split(" ")[1] : full_name.split(" ")[0]
    user["full_name"] = full_name.trim()
    user.name = name.trim()
    return user
  } catch (e) { throw e }
}

exports.getBot = async(ctx) => {
  try {
    bot = ctx.botInfo
    last_name = bot["last_name"] || ""
    full_name = bot.first_name + " " + last_name
    bot["full_name"] = full_name.trim()
    return bot
  } catch { return {} }
}

exports.getLink = async(file_id) => { try { return (await bots.telegram.getFileLink(file_id)).href } catch { throw "Error while get url" } }

exports.getPhotoProfile = async(id) => {
  try {
    url_default = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    if (String(id).startsWith("-100")) {
      let pp = await bots.telegram.getChat(id)
      if (!pp.hasOwnProperty("photo")) return url_default
      file_id = pp.photo.big_file_id
    } else {
      let pp = await bots.telegram.getUserProfilePhotos(id)
      if (pp.total_count == 0) return url_default
      file_id = pp.photos[0][2].file_id
    }
    return await this.getLink(file_id)
  } catch (e) { throw e }
}

exports.getAdmin = async(id) => {
  try {
    let admin = await bots.telegram.getChatAdministrators(id)
    return admin.filter(v => !v.is_anonymous).map(v => new Object({ id: v.user.id, isBot: v.user.is_bot, username: v.user.username, firstName: v.user.first_name, lastName: v.user.last_name }))
  } catch (e) {
    console.log(e.stack)
    return []
  }
}
