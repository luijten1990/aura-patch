const { spawn } = require("node:child_process")

const command = process.platform === "win32" ? "npx.cmd" : "npx"
const server = spawn(command, ["medusa", "start"], {
  env: process.env,
  stdio: "inherit",
})

server.on("exit", (code) => {
  process.exit(code ?? 1)
})

server.on("error", (error) => {
  console.error("Unable to start the Medusa server:", error)
  process.exit(1)
})
