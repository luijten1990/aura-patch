const fs = require("node:fs")
const path = require("node:path")
const { createRequire } = require("node:module")

// Hostinger deploys the nested app directory from Next's monorepo standalone
// output. Include the hoisted runtime dependencies in that directory too.
const root = path.resolve(__dirname, "..")
const standalone = path.join(root, ".next/standalone")
const application = path.join(standalone, "apps/storefront")
const dependencies = path.join(standalone, "node_modules")
if (!fs.existsSync(path.join(application, "server.js"))) {
  throw new Error("Expected Next.js monorepo standalone server is missing")
}
fs.cpSync(dependencies, path.join(application, "node_modules"), {
  recursive: true,
  dereference: true,
  force: false,
})
const resolve = createRequire(path.join(application, "server.js"))
for (const dependency of ["next", "react", "react-dom"]) {
  const resolved = resolve.resolve(dependency)
  if (!resolved.startsWith(application + path.sep)) {
    throw new Error(`Runtime dependency escaped deployment directory: ${dependency}`)
  }
}
console.log("Hostinger standalone dependencies packaged successfully")
