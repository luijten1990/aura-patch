import { commissionAmount } from "./commission"

export const netProductAmount = (itemSubtotal: number, discountTotal = 0) => {
  const items = Number.isFinite(itemSubtotal) ? itemSubtotal : 0
  const discount = Number.isFinite(discountTotal) ? discountTotal : 0
  const net = Math.round((items - discount) * 100) / 100
  return net > 0 ? net : 0
}

export const renewalOrderMetadata = (
  referralCode?: string | null,
  subscriptionId?: string | null
) => {
  const code = referralCode?.trim().toLowerCase()
  if (!code) {
    return undefined
  }
  return {
    referral_code: code,
    referral_source: "renewal" as const,
    subscription_id: subscriptionId || null,
  }
}

export type LedgerRow = {
  orderId: string
  affiliateEmail: string
  base: number
  rate: number
  commission: number
  status: "pending" | "void"
}

export const recordOnce = (rows: LedgerRow[], next: LedgerRow) => {
  const existing = rows.find((row) => row.orderId === next.orderId)
  if (existing) {
    return { rows, created: false as const, row: existing }
  }
  return { rows: [...rows, next], created: true as const, row: next }
}

export const applyRefund = (
  row: LedgerRow,
  refundedProduct: number
) => {
  const refund = Number.isFinite(refundedProduct) ? refundedProduct : row.base
  const remaining = Math.max(0, Math.round((row.base - refund) * 100) / 100)
  if (remaining <= 0) {
    return { ...row, base: 0, commission: 0, status: "void" as const }
  }
  return {
    ...row,
    base: remaining,
    commission: commissionAmount(remaining, row.rate),
    status: "pending" as const,
  }
}

export const rowsForViewer = (rows: LedgerRow[], viewerEmail: string) =>
  rows.filter((row) => row.affiliateEmail === viewerEmail.toLowerCase())
