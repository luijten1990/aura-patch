import { defineMiddlewares } from "@medusajs/framework/utils"
import type { NextFunction, Request, Response } from "express"

const SLOW_REQUEST_MS = 1_000

/**
 * Records only slow write requests made through the storefront API.  The log
 * deliberately excludes request bodies, query values, and headers, so it
 * cannot expose customer, address, or payment data.
 */
const logSlowStoreWrite = (req: Request, res: Response, next: NextFunction) => {
  if (!['POST', 'PUT', 'DELETE'].includes(req.method)) {
    return next()
  }

  const startedAt = performance.now()

  res.once('finish', () => {
    const durationMs = Math.round(performance.now() - startedAt)

    if (durationMs >= SLOW_REQUEST_MS) {
      console.info(
        `[checkout-timing] ${req.method} ${req.baseUrl}${req.path} ${res.statusCode} ${durationMs}ms`
      )
    }
  })

  next()
}

export default defineMiddlewares({
  routes: [
    {
      matcher: '/store/*',
      middlewares: [logSlowStoreWrite],
    },
  ],
})
