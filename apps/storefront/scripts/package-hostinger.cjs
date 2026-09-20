const fs = require("node:fs")
const path = require("node:path")
const { createRequire } = require("node:module")

// Hostinger copies apps/storefront into hbuilds/source, while local builds
// still emit the monorepo nested standalone tree. Find server.js either way.
const root = path.resolve(__dirname, "..")
const standalone = path.join(root, ".next/standalone")

function findStandaloneApp(dir) {
  const candidates = [
    path.join(dir, "apps", "storefront"),
    path.join(dir, "source"),
    dir,
  ]

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, "server.js"))) {
      return candidate
    }
  }

  if (!fs.existsSync(dir)) {
    return null
  }

  const stack = [dir]
  while (stack.length) {
    const current = stack.pop()
    if (fs.existsSync(path.join(current, "server.js"))) {
      return current
    }
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.isDirectory() && entry.name !== "node_modules") {
        stack.push(path.join(current, entry.name))
      }
    }
  }

  return null
}

const application = findStandaloneApp(standalone)
if (!application) {
  throw new Error("Expected Next.js standalone server is missing")
}

const dependencyRoots = [
  path.join(standalone, "node_modules"),
  path.join(application, "node_modules"),
  path.join(root, "node_modules"),
]
const dependencies = dependencyRoots.find((dir) => fs.existsSync(dir))
if (!dependencies) {
  throw new Error("Expected Next.js standalone node_modules is missing")
}

if (path.resolve(dependencies) !== path.resolve(application, "node_modules")) {
  fs.cpSync(dependencies, path.join(application, "node_modules"), {
    recursive: true,
    dereference: true,
    force: false,
  })
}

const resolve = createRequire(path.join(application, "server.js"))
for (const dependency of ["next", "react", "react-dom"]) {
  const resolved = resolve.resolve(dependency)
  if (!resolved.startsWith(application + path.sep)) {
    throw new Error(`Runtime dependency escaped deployment directory: ${dependency}`)
  }
}

console.log(
  `Hostinger standalone dependencies packaged successfully (${path.relative(root, application) || "."})`
)
