/**
 * JSON-LD Structured Data components for SEO rich results.
 * Add these to pages via <Script type="application/ld+json"> or inline.
 */

export function ProductJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Aura Patch — Daily Wellness & Immune Support Patch",
    description:
      "A 30-day transdermal wellness patch with 19 ingredients including stabilized allicin, ashwagandha, vitamins, adaptogens, and probiotics. Peel, apply, go.",
    brand: { "@type": "Brand", name: "Aura Patch" },
    category: "Health & Wellness > Dietary Supplements > Transdermal Patches",
    image: "https://www.getaurapatch.com/images/aura-patch-front-original.jpeg",
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
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
        name: "How do I use Aura Patch?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Remove one patch from its protective backing and apply it to clean, dry skin according to the product instructions.",
        },
      },
      {
        "@type": "Question",
        name: "Where should I apply it?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Choose a clean, dry, relatively hair-free area of healthy, unbroken skin. Avoid lotions or oils where the patch will be placed, as they can affect adhesion.",
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
