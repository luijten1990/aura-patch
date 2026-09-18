import { cartCurrencyCode } from "@lib/util/cart-money"
import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@modules/common/components/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  return (
    <div>
      <div className="flex items-end justify-between border-b border-aura-forest/15 pb-5">
        <Heading className="aura-display text-[44px] font-normal leading-none small:text-[58px]">
          Your cart
        </Heading>
        <span className="pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-aura-forest/55">
          {items?.length ?? 0} {items?.length === 1 ? "item" : "items"}
        </span>
      </div>
      <Table className="block small:table">
        <Table.Header className="hidden border-t-0 small:table-header-group">
          <Table.Row className="border-aura-forest/15 text-[10px] font-semibold uppercase tracking-[0.14em] text-aura-forest/50 hover:bg-transparent">
            <Table.HeaderCell className="!pl-0">Item</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Quantity</Table.HeaderCell>
            <Table.HeaderCell className="hidden small:table-cell">
              Price
            </Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-right">
              Total
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body className="block small:table-row-group">
          {items
            ? items
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                })
                .map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      currencyCode={cartCurrencyCode(cart)}
                      isSubscription={
                        cart?.metadata?.subscription_interval === "monthly"
                      }
                    />
                  )
                })
            : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsTemplate
