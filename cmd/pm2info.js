module.exports = {
  start: async function(ctx) {
    let pm2 = JSON.parse(require("child_process").execSync("pm2 jlist"))
    pm2 = pm2.map(v => ({
      id: v.pm_id,
      pid: v.pid,
      name: v.name,
      restart_time: v.pm2_env.restart_time,
      status: v.pm2_env.status,
      memory: (v.monit.memory / 1024 / 1024).toFixed(1) + "MB",
      cpu: v.monit.cpu + "%"
    }))

    let str = "<b>—————⟨[ PM2 ]⟩—————</b>\n\n"
    str += pm2.map(v => `
<b>ID</b>: ${v.id}
<b>PID</b>: ${v.pid}
<b>Name</b>: ${v.name}
<b>Restart</b>: ${v.restart_time}
<b>Status</b>: ${v.status}
<b>Memory</b>: ${v.memory}
<b>CPU</b>: ${v.cpu}
`.trim()).join("\n\n")

    await ctx.replyWithHTML(str)
  },
  owner: true,
  tags: "owner",
  help: ["pm2info", "pm2i"],
  desc: "Menampilkan info pm2"
}
