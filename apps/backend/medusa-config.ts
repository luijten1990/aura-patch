import { loadEnv, defineConfig } from '@medusajs/framework/utils'
import path from 'path'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const localPackageDir = (pkg: string) =>
  path.dirname(
    require.resolve(`${pkg}/package.json`, {
      paths: [__dirname],
    })
  )

const stripeProvider =
  process.env.STRIPE_API_KEY && process.env.STRIPE_WEBHOOK_SECRET
    ? [
        {
          resolve: "@medusajs/medusa/payment-stripe",
          id: "stripe",
          options: {
            apiKey: process.env.STRIPE_API_KEY,
            webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
          },
        },
      ]
    : []

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },

  admin: {
    vite: () => ({
      resolve: {
        alias: {
          react: localPackageDir('react'),
          'react-dom': localPackageDir('react-dom'),
        },
        dedupe: ['react', 'react-dom'],
      },
    }),
  },

  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: stripeProvider,
      },
    },
  ],
})
