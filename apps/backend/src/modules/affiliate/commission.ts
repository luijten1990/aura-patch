export const commissionAmount = (base: number, rate: number) => {
  if (!Number.isFinite(base) || base <= 0) {
    return 0
  }
  const percent = Number.isFinite(rate) ? rate : 20
  return Math.round(base * percent) / 100
}
