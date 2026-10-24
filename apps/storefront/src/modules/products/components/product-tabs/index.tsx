"use client"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const facts = [
    product.material ? ["Material", product.material] : null,
    product.origin_country ? ["Country of origin", product.origin_country] : null,
    product.type?.value ? ["Type", product.type.value] : null,
    product.weight ? ["Weight", `${product.weight} g`] : null,
    product.length && product.width && product.height
      ? [
          "Dimensions",
          `${product.length}L x ${product.width}W x ${product.height}H`,
        ]
      : null,
  ].filter((fact): fact is [string, string] => Boolean(fact))

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {facts.length > 0 && (
          <Accordion.Item
            title="Product Information"
            headingSize="medium"
            value="Product Information"
          >
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 py-8 text-small-regular">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <span className="font-semibold">{label}</span>
                  <p>{value}</p>
                </div>
              ))}
            </div>
          </Accordion.Item>
        )}
        <Accordion.Item
          title="Shipping & Returns"
          headingSize="medium"
          value="Shipping & Returns"
        >
          <div className="flex flex-col gap-y-4 py-8 text-small-regular">
            <p className="max-w-sm">
              Shipping and tax are calculated at checkout for the address you
              enter.
            </p>
            <p className="max-w-sm">
              Return and refund terms shown at checkout and on the terms page
              apply to the order.
            </p>
          </div>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}

export default ProductTabs
