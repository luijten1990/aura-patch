import { HttpTypes } from "@medusajs/types"
import { Table, Text } from "@modules/common/components/ui"

import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Thumbnail from "@modules/products/components/thumbnail"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  currencyCode: string
}

const Item = ({ item, currencyCode }: ItemProps) => {
  const thumbnail =
    item.product_handle === "aura-patch"
      ? "/images/aura-core-front.webp"
      : item.thumbnail

  return (
    <Table.Row
      className="w-full border-aura-forest/15 hover:bg-transparent"
      data-testid="product-row"
    >
      <Table.Cell className="w-24 !p-0 py-6">
        <div className="flex w-16 small:w-20">
          <Thumbnail
            thumbnail={thumbnail}
            size="square"
            className="!rounded-[1.25rem] !border !border-aura-forest/10 !bg-[#f5efe4] !p-0 !shadow-none"
          />
        </div>
      </Table.Cell>

      <Table.Cell className="text-left">
        <Text
          className="text-[16px] font-semibold leading-6 text-aura-forest"
          data-testid="product-name"
        >
          {item.product_title}
        </Text>
        <div className="mt-1 text-[12px] text-aura-forest/55">
          <LineItemOptions variant={item.variant} data-testid="product-variant" />
        </div>
      </Table.Cell>

      <Table.Cell className="!pr-0">
        <span className="flex h-full flex-col items-end justify-center !pr-0">
          <span className="flex gap-x-1 text-aura-forest/60">
            <Text className="text-[13px] text-aura-forest/55">
              <span data-testid="product-quantity">{item.quantity}</span>x{" "}
            </Text>
            <LineItemUnitPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </span>

          <span className="text-[15px] font-semibold text-aura-forest">
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </span>
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
