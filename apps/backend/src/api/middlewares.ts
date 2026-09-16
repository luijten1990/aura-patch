import {
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http"
import type { NextFunction, Request, Response } from "express"
import { PostStoreWelcomeOfferSchema } from "./store/welcome-offer/validators"

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
      // Hostinger's runtime-log view suppresses info-level application output.
      // Warning makes only the slow, privacy-safe measurements visible there.
      console.warn(
        `[checkout-timing] ${req.method} ${req.baseUrl}${req.path} ${res.statusCode} ${durationMs}ms`
      )
    }
  })

  next()
}

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/welcome-offer",
      method: "POST",
      middlewares: [validateAndTransformBody(PostStoreWelcomeOfferSchema)],
    },
    {
      matcher: "/store/*",
      middlewares: [logSlowStoreWrite],
    },
  ],
})
