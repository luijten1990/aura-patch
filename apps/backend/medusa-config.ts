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
            // Lets Payment Element / Express Checkout offer PayPal, Google Pay,
            // Apple Pay, and other methods enabled on the Stripe account.
            automatic_payment_methods: true,
          },
        },
      ]
    : []

// EasyPost is registered only when the required server-side credentials exist.
// This prevents an incomplete production configuration from appearing as a
// selectable shipping provider in Medusa Admin.
const easypostProvider =
  process.env.EASYPOST_API_KEY &&
  process.env.EASYPOST_ITEM_DESCRIPTION &&
  process.env.EASYPOST_ITEM_VALUE_USD &&
  process.env.EASYPOST_PACKAGE_LENGTH_IN &&
  process.env.EASYPOST_PACKAGE_WIDTH_IN &&
  process.env.EASYPOST_PACKAGE_HEIGHT_IN
    ? [
        {
          resolve: "./src/modules/easypost",
          id: "easypost",
          options: {
            apiKey: process.env.EASYPOST_API_KEY,
            baseUrl: process.env.EASYPOST_API_BASE_URL || "https://api.easypost.com/v2",
            itemDescription: process.env.EASYPOST_ITEM_DESCRIPTION,
            itemValueUsd: Number(process.env.EASYPOST_ITEM_VALUE_USD),
            itemHsCode: process.env.EASYPOST_ITEM_HS_CODE,
            customsSigner: process.env.EASYPOST_CUSTOMS_SIGNER || "Aura Patch",
            originName: process.env.EASYPOST_ORIGIN_NAME || "AURA PATCH CO.",
            originCompany: process.env.EASYPOST_ORIGIN_COMPANY || "NOOR VENTURES LLC",
            originPhone: process.env.EASYPOST_ORIGIN_PHONE || "2064862392",
            originEmail:
              process.env.EASYPOST_ORIGIN_EMAIL ||
              process.env.BREVO_SENDER_EMAIL ||
              "info@getaurapatch.com",
            originStreet: process.env.EASYPOST_ORIGIN_STREET || "55 Atlanta St SE",
            originCity: process.env.EASYPOST_ORIGIN_CITY || "Marietta",
            originState: process.env.EASYPOST_ORIGIN_STATE || "GA",
            originZip: process.env.EASYPOST_ORIGIN_ZIP || "30060-1977",
            originCountry: process.env.EASYPOST_ORIGIN_COUNTRY || "US",
            originAddressId: process.env.EASYPOST_ORIGIN_ADDRESS_ID ||
              "adr_104b49ddb44711f1972a00224804dbec",
            weightOz: Number(process.env.EASYPOST_PACKAGE_WEIGHT_OZ || 3),
            lengthIn: Number(process.env.EASYPOST_PACKAGE_LENGTH_IN),
            widthIn: Number(process.env.EASYPOST_PACKAGE_WIDTH_IN),
            heightIn: Number(process.env.EASYPOST_PACKAGE_HEIGHT_IN),
            brevoApiKey: process.env.BREVO_API_KEY,
            labelEmailTo:
              process.env.EASYPOST_LABEL_EMAIL_TO || "orders@getaurapatch.com",
            labelEmailFrom:
              process.env.BREVO_SENDER_EMAIL || "info@getaurapatch.com",
            labelEmailFromName:
              process.env.BREVO_SENDER_NAME || "Aura Patch Orders",
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
      resolve: "@medusajs/medusa/fulfillment",
      options: {
        providers: [...easypostProvider],
      },
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: stripeProvider,
      },
    },
    {
      resolve: "./src/modules/subscription",
    },
  ],
})
