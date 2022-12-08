module.exports = {
  start: async function(ctx, { user, text }) {
    const anime = require("anime-actions")
    const random = await anime.yes()
    const who = ctx.parseMention()[0] ? ctx.parseMention()[0] : ctx.message.reply_to_message?.username ? "@" + ctx.message.reply_to_message?.username : "everyone"
    const caption = who == "@" + user.username ? `I gives you a thumbs up 👍🏼` : who ? `@${user.username} Gives ${who} a thumbs up 👍🏼` : random

    if(who == "@" + bot.botInfo.username) return await ctx.reply("I can\'t give myself a thumbs up :(")

    if(random.endsWith(".gif")) await ctx.replyWithAnimation({
      source: await ft.toMp4(null, random)
    }, {
      caption,
      reply_to_message_id: ctx.message.message_id
    })
    else await ctx.replyWithPhoto({
      url: random
    }, {
      caption,
      reply_to_message_id: ctx.message.message_id
    })
  },
  tags: "anime",
  help: ["yes", "thumbsup"],
  desc: "Random anime image/gif"
}
