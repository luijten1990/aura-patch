const http = require("node:http")
const { existsSync } = require("node:fs")
const path = require("node:path")
const { createRequire } = require("node:module")

// Hostinger starts the source-root entry even when an output folder is set.
const compiledDirectory = path.join(__dirname, ".medusa", "server")
const runtimeDirectory = existsSync(path.join(compiledDirectory, "medusa-config.js"))
  ? compiledDirectory
  : __dirname
process.chdir(runtimeDirectory)
const runtimeRequire = createRequire(path.join(runtimeDirectory, "package.json"))
let app
let shutdown
let stopping = false

// Hostinger intercepts listen() in this process before asynchronous setup.
// Return 503 until Medusa is ready, including for health checks.
const server = http.createServer((req, res) => {
  if (!app || stopping) {
    res.writeHead(503, { "Content-Type": "text/plain", "Retry-After": "10" })
    res.end("Service temporarily unavailable")
    return
  }
  app(req, res)
})
server.on("error", (error) => {
  console.error("Hostinger listener failed:", error)
  process.exit(1)
})
server.listen(process.env.PORT || 9000)

const stop = async () => {
  if (stopping) return
  stopping = true
  setTimeout(() => process.exit(1), 10000).unref()
  try {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()))
    })
    if (shutdown) await shutdown()
    process.exit(0)
  } catch (error) {
    console.error("Medusa shutdown failed:", error)
    process.exit(1)
  }
}
process.on("SIGTERM", stop)
process.on("SIGINT", stop)

// Migrations are a separate deployment operation, never a web startup task.
setImmediate(async () => {
  try {
    const medusaRequire = createRequire(runtimeRequire.resolve("@medusajs/medusa/package.json"))
    const express = medusaRequire("express")
    const { registerInstrumentation } = runtimeRequire("@medusajs/medusa/commands/start")
    const loaders = runtimeRequire("@medusajs/medusa/loaders/index").default
    await registerInstrumentation(runtimeDirectory)
    const application = express()
    const loaded = await loaders({ directory: runtimeDirectory, expressApp: application })
    shutdown = loaded.shutdown
    application.get("/health", (_req, res) => res.status(200).send("OK"))
    if (stopping) {
      await shutdown()
      return
    }
    app = application
    console.info("Medusa ready: database and application loaded")
  } catch (error) {
    console.error("Unable to initialize Medusa:", error)
    process.exit(1)
  }
})
