const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const usd = (value) => currency.format(Number(value) || 0)

export function formatDate(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export const makeId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `build-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
