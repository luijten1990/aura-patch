/**
 * JSON-LD Structured Data components for SEO rich results.
 * Add these to pages via <Script type="application/ld+json"> or inline.
 */

export function ProductJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Aura Patch — Daily Wellness Patch",
    description:
      "Aura Patch is your daily defense. Wear one patch every day. Vitamin C, zinc, and vitamin A are included for their roles in normal immune function. Peel, apply, go. A 30-day pouch.",
    brand: { "@type": "Brand", name: "Aura Patch" },
    category: "Health & Wellness > Dietary Supplements > Transdermal Patches",
    image: "https://www.getaurapatch.com/images/aura-patch-pouch-front-current.jpeg",
    url: "https://www.getaurapatch.com/us/products/aura-patch",
    sku: "AURA-PATCH-30",
    offers: {
      "@type": "Offer",
      url: "https://www.getaurapatch.com/us/products/aura-patch",
      priceCurrency: "USD",
      price: "49.99",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "Aura Patch" },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function FAQJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Aura Patch for?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Aura Patch is your daily defense. Wear it every day. Vitamin C, zinc, and vitamin A are included for their established roles in normal immune function. It does not treat or cure any infection or disease.",
        },
      },
      {
        "@type": "Question",
        name: "How do I use Aura Patch?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Remove one patch from its protective backing and apply it to clean, dry skin according to the product instructions. Aura Patch is meant to be worn daily.",
        },
      },
      {
        "@type": "Question",
        name: "Where should I apply it?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Choose a clean, dry, relatively hair-free area of healthy, unbroken skin, such as your upper arm or stomach. Avoid lotions or oils where the patch will be placed, as they can affect adhesion.",
        },
      },
      {
        "@type": "Question",
        name: "Can you shower with it?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Showering with the patch on is not ideal. Apply it after you shower, once you have dried off.",
        },
      },
      {
        "@type": "Question",
        name: "How long can I wear it?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Aura is designed for comfortable wear for up to 12 hours. Always follow the directions on your product packaging and remove the patch sooner if irritation occurs.",
        },
      },
      {
        "@type": "Question",
        name: "How many patches are included?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Each pouch is designed as a 30-day supply, with one patch for each day of your routine.",
        },
      },
      {
        "@type": "Question",
        name: "Can I take Aura Patch with me?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The lightweight pouch and individually protected patches make it easy to keep your routine with you.",
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Aura Patch",
    url: "https://www.getaurapatch.com",
    logo: "https://www.getaurapatch.com/images/aura-patch-logo.webp",
    description:
      "Aura Patch creates daily wellness transdermal patches — a simpler, pill-free approach to supporting your health with 19 thoughtfully formulated ingredients.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@getaurapatch.com",
      contactType: "customer service",
    },
    sameAs: [],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebsiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Aura Patch",
    url: "https://www.getaurapatch.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.getaurapatch.com/us/store?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
