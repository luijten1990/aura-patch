const { spawn } = require("node:child_process")
const { existsSync } = require("node:fs")
const path = require("node:path")

// Hostinger starts the source-root entry even when an output folder is set.
const compiledDirectory = path.join(__dirname, ".medusa", "server")
const runtimeDirectory = existsSync(path.join(compiledDirectory, "medusa-config.js"))
  ? compiledDirectory
  : __dirname
process.chdir(runtimeDirectory)
const medusaCli = require.resolve("@medusajs/cli/cli.js", {
  paths: [runtimeDirectory],
})

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

// The bundled migration script contains demo European catalog data.
run(["db:migrate", "--skip-scripts"])
  .then(() => run(["start"]))
  .catch((error) => {
    console.error("Unable to start the Medusa server:", error)
    process.exit(1)
  })
