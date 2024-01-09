const sizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}
export function ErrorList({ id, errors, size }: { errors?: any; id?: string; size?: string }) {
  const errorsToRender = errors?.filter(Boolean)
  if (!errorsToRender?.length) return null
  return (
    <ul id={id} className="space-y-1">
      {errorsToRender.map(e => (
        <li key={e} className={`text-[10px] text-warning ${sizes[size]}`}>
          {e}
        </li>
      ))}
    </ul>
  )
}
