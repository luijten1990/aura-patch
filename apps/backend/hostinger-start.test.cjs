const { test } = require("node:test")
const assert = require("node:assert/strict")
const { readFileSync } = require("node:fs")
const vm = require("node:vm")
const path = require("node:path")

const source = readFileSync(path.join(__dirname, "hostinger-start.js"), "utf8")

function boot({ compiled = true, fail = false } = {}) {
  const state = { events: [], exits: [], signals: {} }
  const application = (_req, res) => res.end("application")
  application.get = (route, handler) => { state.health = handler }
  const runtimeRequire = (name) => {
    if (name === "express") return () => application
    if (name.endsWith("commands/start")) return { registerInstrumentation: async () => {} }
    if (name.endsWith("loaders/index")) return {
      default: async () => {
        if (fail) throw new Error("test initialization failure")
        return { shutdown: async () => { state.stopped = true } }
      },
    }
    throw new Error(`Unexpected module: ${name}`)
  }
  runtimeRequire.resolve = (name) => name
  const server = {
    on: () => server,
    listen: (port) => state.events.push(["listen", port]),
    close: (callback) => callback(),
  }
  vm.runInNewContext(source, {
    __dirname: "/app",
    require: (name) => {
      if (name === "node:http") return { createServer: (handler) => { state.handler = handler; return server } }
      if (name === "node:fs") return { existsSync: () => compiled }
      if (name === "node:path") return path
      if (name === "node:module") return { createRequire: () => runtimeRequire }
      throw new Error(`Unexpected dependency: ${name}`)
    },
    process: {
      env: { PORT: "8123" },
      chdir: (directory) => { state.directory = directory },
      on: (signal, fn) => { state.signals[signal] = fn },
      exit: (code) => state.exits.push(code),
    },
    console: { info: () => {}, error: () => {} },
    setImmediate: (fn) => { state.initialize = fn },
    setTimeout: () => ({ unref() {} }),
  })
  return state
}

function response() {
  return {
    writeHead(code) { this.code = code },
    status(code) { this.code = code; return this },
    send(body) { this.body = body },
    end(body) { this.body = body },
  }
}

test("listens synchronously and reports unavailable until initialization completes", async () => {
  const state = boot()
  assert.deepEqual(state.events, [["listen", "8123"]])
  assert.equal(state.directory, "/app/.medusa/server")
  const pending = response()
  state.handler({ url: "/health" }, pending)
  assert.equal(pending.code, 503)
  await state.initialize()
  const ready = response()
  state.health({}, ready)
  assert.equal(ready.code, 200)
  const routed = response()
  state.handler({}, routed)
  assert.equal(routed.body, "application")
  await state.signals.SIGTERM()
  assert.equal(state.stopped, true)
  assert.deepEqual(state.exits, [0])
})

test("supports an entry already inside the compiled directory", () => {
  assert.equal(boot({ compiled: false }).directory, "/app")
})

test("failed initialization never reports healthy and exits unsuccessfully", async () => {
  const state = boot({ fail: true })
  await state.initialize()
  assert.deepEqual(state.exits, [1])
  const result = response()
  state.handler({ url: "/health" }, result)
  assert.equal(result.code, 503)
})
