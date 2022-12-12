module.exports = {
  start: async function(ctx, { Telegram, user }) {
    global.db.tictactoe = { ...global.db.tictactoe }

    if(!global.db.tictactoe[ctx.chat.id]) {
      global.db.tictactoe[ctx.chat.id] = {
        p1: [ctx.from.id, ctx.from.username],
        p2: null,
        turn: null,
        status: "waiting",
        button: Markup.inlineKeyboard([
          [
            Markup.button.callback("1", "TeleBot-ttt 1"),
            Markup.button.callback("2", "TeleBot-ttt 2"),
            Markup.button.callback("3", "TeleBot-ttt 3")
          ],
          [
            Markup.button.callback("4", "TeleBot-ttt 4"),
            Markup.button.callback("5", "TeleBot-ttt 5"),
            Markup.button.callback("6", "TeleBot-ttt 6")
          ],
          [
            Markup.button.callback("7", "TeleBot-ttt 7"),
            Markup.button.callback("8", "TeleBot-ttt 8"),
            Markup.button.callback("9", "TeleBot-ttt 9")
          ]
        ])
      }
      await ctx.reply(`
⟨[ TicTacToe Games ]⟩

Player 1: @${global.db.tictactoe[ctx.chat.id].p1[1]}
Player 2: ---

Waiting for other players
`, Markup.inlineKeyboard([
        Markup.button.callback("Join", "ttt")
      ]))
    } else {
      if(global.db.tictactoe[ctx.chat.id].p1[0] == ctx.from.id) return await ctx.reply("What are you doing?")
      if(global.db.tictactoe[ctx.chat.id].status == "playing") return await ctx.reply("There\'s still a game going on!")

      global.db.tictactoe[ctx.chat.id].p2 = [ctx.from.id, ctx.from.username]
      global.db.tictactoe[ctx.chat.id].status = "playing"
      global.db.tictactoe[ctx.chat.id].turn = global.db.tictactoe[ctx.chat.id].p1[0]
      await ctx.reply(`
⟨[ TicTacToe Games ]⟩

Player 1: @${global.db.tictactoe[ctx.chat.id].p1[1]}
Player 2: @${global.db.tictactoe[ctx.chat.id].p2[1]}

@${global.db.tictactoe[ctx.chat.id].p1[0] == global.db.tictactoe[ctx.chat.id].turn ? global.db.tictactoe[ctx.chat.id].p1[1] : global.db.tictactoe[ctx.chat.id].p2[1]} turn
`, Markup.inlineKeyboard([
        [
          Markup.button.callback("1", "TeleBot-ttt 1"),
          Markup.button.callback("2", "TeleBot-ttt 2"),
          Markup.button.callback("3", "TeleBot-ttt 3")
        ],
        [
          Markup.button.callback("4", "TeleBot-ttt 4"),
          Markup.button.callback("5", "TeleBot-ttt 5"),
          Markup.button.callback("6", "TeleBot-ttt 6")
        ],
        [
          Markup.button.callback("7", "TeleBot-ttt 7"),
          Markup.button.callback("8", "TeleBot-ttt 8"),
          Markup.button.callback("9", "TeleBot-ttt 9")
        ]
      ]))
    }
  },
  registered: true,
  tags: "game",
  help: ["tictactoe", "ttt"],
  desc: "Game TicTacToe"
}
