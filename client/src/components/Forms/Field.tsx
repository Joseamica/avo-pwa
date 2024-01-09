import { useId } from 'react'
import { Input } from './Input'
import { ErrorList } from './ErrorsList'

export function Field({
  labelProps,
  inputProps,
  errors,
  errorSize,
  className,
}: {
  labelProps: Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'className'>
  inputProps: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'>
  errors?: any
  errorSize?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const fallbackId = useId()
  const id = inputProps.id ?? fallbackId
  const errorId = errors?.length ? `${id}-error` : undefined
  const errorExist = errors?.length && errors[0] !== undefined
  return (
    <div className={className}>
      <label htmlFor={id} {...labelProps} />
      <Input
        id={id}
        error={errorExist ? true : false}
        aria-invalid={errorId ? true : undefined}
        aria-describedby={errorId}
        {...inputProps}
      />
      <div className="min-h-[32px] pb-3 pt-1">{errorId ? <ErrorList id={errorId} errors={errors} size={errorSize} /> : null}</div>
    </div>
  )
}
