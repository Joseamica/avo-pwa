export function Currency(amount: string | number, currency?: string) {
  const convertedAmount = Number(amount) / 100

  return (
    <span>
      {/* {amount.toLocaleString('en-US', {
        style: 'currency',
        currency: currency || 'USD',
      })} */}
      ${convertedAmount.toFixed(2)}
    </span>
  )
}
