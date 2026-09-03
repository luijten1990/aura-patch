import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import localFont from "next/font/local"
import "styles/globals.css"

const hedvigLettersSerif = localFont({
  src: "./fonts/hedvig-letters-serif.ttf",
  variable: "--font-hedvig-serif",
  display: "swap",
})

const manrope = localFont({
  src: [
    { path: "./fonts/manrope-400.ttf", weight: "400", style: "normal" },
    { path: "./fonts/manrope-500.ttf", weight: "500", style: "normal" },
    { path: "./fonts/manrope-600.ttf", weight: "600", style: "normal" },
    { path: "./fonts/manrope-700.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-manrope",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "Aura Patch",
    template: "%s | Aura Patch",
  },
  description: "Daily wellness, beautifully simplified.",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body className={`${hedvigLettersSerif.variable} ${manrope.variable}`}>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
