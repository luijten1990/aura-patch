const { spawn } = require("node:child_process")

const medusaCli = require.resolve("@medusajs/cli/cli.js")

const run = (args) =>
  new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [medusaCli, ...args], {
      env: process.env,
      stdio: "inherit",
    })

    child.on("exit", (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Medusa ${args.join(" ")} exited with code ${code}`))
      }
    })
    child.on("error", reject)
  })

run(["db:migrate"])
  .then(() => run(["start"]))
  .catch((error) => {
    console.error("Unable to start the Medusa server:", error)
    process.exit(1)
  })
