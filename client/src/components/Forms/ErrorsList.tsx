const sizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}
export function ErrorList({ id, errors, size }: { errors?: any; id?: string; size?: string }) {
  if (typeof errors === 'string') {
    return (
      <ul id={id} className="space-y-1">
        <li className={`text-[10px] text-main-warning ${sizes[size]}`}>{errors}</li>
      </ul>
    )
  }
  const errorsToRender = errors?.filter(Boolean)
  if (!errorsToRender?.length) return null
  return (
    <ul id={id} className="space-y-1">
      {errorsToRender.map(e => (
        <li key={e} className={`text-[10px] text-black ${sizes[size]}`}>
          {e}
        </li>
      ))}
    </ul>
  )
}
