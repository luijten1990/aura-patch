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

// USPS is registered only when the required server-side credentials exist.
// This prevents an incomplete production configuration from appearing as a
// selectable shipping provider in Medusa Admin.
const uspsProvider =
  process.env.USPS_CLIENT_ID &&
  process.env.USPS_CLIENT_SECRET &&
  process.env.USPS_CRID &&
  process.env.USPS_MID &&
  process.env.USPS_PAYMENT_ACCOUNT_NUMBER &&
  process.env.USPS_DEFAULT_WEIGHT_OZ &&
  process.env.USPS_DEFAULT_LENGTH_IN &&
  process.env.USPS_DEFAULT_WIDTH_IN &&
  process.env.USPS_DEFAULT_HEIGHT_IN
    ? [
        {
          resolve: "./src/modules/usps",
          id: "usps",
          options: {
            clientId: process.env.USPS_CLIENT_ID,
            clientSecret: process.env.USPS_CLIENT_SECRET,
            crid: process.env.USPS_CRID,
            mid: process.env.USPS_MID,
            paymentAccountNumber: process.env.USPS_PAYMENT_ACCOUNT_NUMBER,
            paymentAccountType: process.env.USPS_PAYMENT_ACCOUNT_TYPE || "EPS",
            permitZipCode: process.env.USPS_PERMIT_ZIP_CODE,
            baseUrl:
              process.env.USPS_API_BASE_URL || "https://apis-tem.usps.com",
            mailClass: process.env.USPS_MAIL_CLASS || "PRIORITY_MAIL",
            rateIndicator: process.env.USPS_RATE_INDICATOR || "SP",
            weightOz: Number(process.env.USPS_DEFAULT_WEIGHT_OZ),
            lengthIn: Number(process.env.USPS_DEFAULT_LENGTH_IN),
            widthIn: Number(process.env.USPS_DEFAULT_WIDTH_IN),
            heightIn: Number(process.env.USPS_DEFAULT_HEIGHT_IN),
            brevoApiKey: process.env.BREVO_API_KEY,
            labelEmailTo: process.env.USPS_LABEL_EMAIL_TO || "orders@getaurapatch.com",
            labelEmailFrom:
              process.env.BREVO_SENDER_EMAIL || "info@getaurapatch.com",
            labelEmailFromName:
              process.env.BREVO_SENDER_NAME || "Aura Patch Orders",
          },
        },
      ]
    : []

const easyshipProvider =
  process.env.EASYSHIP_API_TOKEN &&
  process.env.EASYSHIP_ITEM_DESCRIPTION &&
  process.env.EASYSHIP_ITEM_VALUE_USD &&
  process.env.EASYSHIP_PACKAGE_LENGTH_IN &&
  process.env.EASYSHIP_PACKAGE_WIDTH_IN &&
  process.env.EASYSHIP_PACKAGE_HEIGHT_IN
    ? [{
        resolve: "./src/modules/easyship",
        id: "easyship",
        options: {
          apiToken: process.env.EASYSHIP_API_TOKEN,
          itemDescription: process.env.EASYSHIP_ITEM_DESCRIPTION,
          itemValueUsd: Number(process.env.EASYSHIP_ITEM_VALUE_USD),
          itemHsCode: process.env.EASYSHIP_ITEM_HS_CODE,
          weightOz: Number(process.env.EASYSHIP_PACKAGE_WEIGHT_OZ || 3),
          lengthIn: Number(process.env.EASYSHIP_PACKAGE_LENGTH_IN),
          widthIn: Number(process.env.EASYSHIP_PACKAGE_WIDTH_IN),
          heightIn: Number(process.env.EASYSHIP_PACKAGE_HEIGHT_IN),
        },
      }]
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
        providers: [...uspsProvider, ...easyshipProvider],
      },
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: stripeProvider,
      },
    },
  ],
})
