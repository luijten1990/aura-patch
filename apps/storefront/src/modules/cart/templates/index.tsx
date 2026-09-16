import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <main className="min-h-[70vh] bg-aura-cream py-12 text-aura-forest small:py-20">
      <div className="content-container" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 gap-10 small:grid-cols-[minmax(0,1fr)_380px] small:gap-12">
            <div className="flex min-w-0 flex-col gap-y-8">
              {!customer && (
                <>
                  <SignInPrompt />
                  <Divider className="border-aura-forest/15" />
                </>
              )}
              <ItemsTemplate cart={cart} />
            </div>
            <div className="relative">
              <div className="sticky top-12 flex flex-col gap-y-8">
                {cart && cart.region && (
                  <div className="rounded-[1.75rem] border border-aura-forest/15 bg-[#f5efe4] p-6 small:p-8">
                    <Summary cart={cart} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </main>
  )
}

export default CartTemplate
