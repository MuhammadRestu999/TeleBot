module.exports = {
  start: async function(ctx) {
    let res = await ctx.getChat(ctx.chat.id)
    let str = `
${"=".repeat(10)}<b>Group Info</b>${"=".repeat(10)}\n
ID : <pre>${res.id}</pre>
Name : ${res.title}
Type : ${res.type}${res.invite_link ? "\nLink : " + res.invite_link : ""}
Member can :
  Send message : ${res.permissions.can_send_messages ? "Yes" : "No"}
  Send media : ${res.permissions.can_send_media_messages ? "Yes" : "No"}
  Send polls : ${res.permissions.can_send_polls ? "Yes" : "No"}
  Send other message : ${res.permissions.can_send_other_message ? "Yes" : "No"}
  Add web page preview : ${res.permissions.can_add_web_page_preview ? "Yes" : "No"}
  Change info : ${res.permissions.can_change_info ? "Yes" : "No"}
  Invite users : ${res.permissions.can_invite_users ? "Yes" : "No"}
  Pin message : ${res.permissions.can_pin_message ? "Yes" : "No"}
`.trim()
    ctx.replyWithHTML(str)
  },
  admin: true,
  group: true,
  tags: "admin",
  help: ["groupinfo", "infogroup"],
  desc: "Get group information"
}
