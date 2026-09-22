#!/usr/bin/env node
import { spawnSync } from "node:child_process"
import { readdirSync, readFileSync, statSync } from "node:fs"
import { extname, join, relative } from "node:path"

const root = new URL("..", import.meta.url).pathname.replace(/\/$/, "")
const mode = process.argv.includes("--plan")
  ? "plan"
  : process.argv.includes("--scan")
    ? "scan"
    : "run"

const checks = [
  {
    id: "lint-storefront",
    required: true,
    title: "Lint the Next.js storefront",
    cwd: "apps/storefront",
    command: ["npm", "run", "lint"],
  },
  {
    id: "typecheck-storefront",
    required: true,
    title: "Typecheck the storefront",
    cwd: "apps/storefront",
    command: ["npm", "run", "typecheck"],
  },
  {
    id: "test-storefront",
    required: true,
    title: "Storefront unit tests (cart/subscription helpers)",
    cwd: "apps/storefront",
    command: ["npm", "test"],
  },
  {
    id: "test-subscribe-cart",
    required: true,
    title: "Backend subscribe-cart unit tests",
    cwd: "apps/backend",
    command: [
      "npm",
      "run",
      "test:unit",
      "--",
      "src/lib/__tests__/resolve-cart-subscription.unit.spec.ts",
    ],
  },
  {
    id: "lint-backend",
    required: false,
    title: "Lint the Medusa backend (needed for backend/checkout work)",
    cwd: "apps/backend",
    command: ["npm", "run", "lint"],
  },
]

const scanRoots = [
  "apps/storefront/src",
  "apps/backend/src",
  "docs",
  "agents",
]
const scanSkip = new Set(["node_modules", ".next", ".medusa", "dist", ".git"])
const scanExt = new Set([".ts", ".tsx", ".js", ".jsx", ".md", ".html", ".css"])
const scanTerms = [
  "TODO",
  "FIXME",
  "placeholder",
  "lorem ipsum",
  "mock data",
  "console.log",
  "temporary",
  "coming soon",
  "example.com",
  "dummy",
  "test content",
]

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (scanSkip.has(name)) continue
    const path = join(dir, name)
    const stat = statSync(path)
    if (stat.isDirectory()) walk(path, files)
    else if (scanExt.has(extname(name))) files.push(path)
  }
  return files
}

if (mode === "plan") {
  for (const check of checks) {
    console.log(
      `${check.required ? "required" : "optional"}\t${check.id}\t${check.title}\t${check.cwd} ${check.command.join(" ")}`
    )
  }
  process.exit(0)
}

if (mode === "scan") {
  console.log("Scan candidates (not confirmed bugs):")
  let hits = 0
  for (const start of scanRoots) {
    const abs = join(root, start)
    try {
      statSync(abs)
    } catch {
      continue
    }
    for (const file of walk(abs)) {
      const text = readFileSync(file, "utf8")
      const lines = text.split("\n")
      lines.forEach((line, index) => {
        const match = scanTerms.find((term) =>
          line.toLowerCase().includes(term.toLowerCase())
        )
        if (!match) return
        hits += 1
        console.log(`${relative(root, file)}:${index + 1}: ${match}: ${line.trim()}`)
      })
    }
  }
  if (!hits) console.log("No scan terms found.")
  process.exit(0)
}

let failed = 0
for (const check of checks) {
  console.log(`\n== ${check.id}: ${check.title}`)
  const result = spawnSync(check.command[0], check.command.slice(1), {
    cwd: join(root, check.cwd),
    stdio: "inherit",
    env: process.env,
  })
  if (result.status !== 0) {
    console.error(`Check ${check.id} failed with exit ${result.status}`)
    if (check.required) failed = 1
  }
}
process.exit(failed)
