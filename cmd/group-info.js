module.exports = {
  start: async function(ctx, { Telegram, user, message, text, is }) {
    let res = await ctx.getChat(ctx.chat.id)
    let str = `
${"=".repeat(10)}**Group Info**${"=".repeat(10)}\n
ID : \`\`\`${res.id}\`\`\`
Name : ${res.title}
Type : ${res.type}${res.invite_link ? "\nLink : " + res.invite_link : ""}
Member can :
  Send message : ${res.permissions.can_send_messages ? "Yes" : "No"}
  Send media : ${res.permissions.can_send_media_messages ? "Yes" : "No"}
  Send polls : ${res.permissions.can_send_polls ? "Yes" : "No"}
  Send other message : ${res.permissions.can_send_other_message ? "Yes" : "No"}
  Add web page preview : ${res.permissions.can_ ? "Yes" : "No"}
  Change info : ${res.permissions.can_change_info ? "Yes" : "No"}
  Invite users : ${res.permissions.can_invite_users ? "Yes" : "No"}
  Pin message : ${res.permissions.can_pin_message ? "Yes" : "No"}
`.trim()
    ctx.replyWithMarkdown(str)
  },
  admin: true,
  group: true,
  tags: "admin",
  help: ["groupinfo", "infogroup"],
  desc: "Get group information"
}
