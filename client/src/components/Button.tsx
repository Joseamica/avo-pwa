import clsx from 'clsx'
import React from 'react'
import { Link } from 'react-router-dom'

interface ButtonProps {
  fullWith?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'icon' | 'payment' | 'custom'
  size?: 'small' | 'medium' | 'large' | 'icon'
  children: React.ReactNode | React.ReactNode[]
  to?: string
  custom?: string
}

interface LinkProps {
  fullWith?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'icon' | 'payment' | 'custom'
  size?: 'small' | 'medium' | 'large' | 'icon'
  children: React.ReactNode | React.ReactNode[]
  to: string
  custom?: string
  onClick?: () => void
}

function getClassName({ className, fullWith }: { className?: string; fullWith?: boolean }) {
  return clsx(
    'group relative inline-flex text-lg  focus:outline-none opacity-100 disabled:opacity-50 transition ',
    { 'w-full': fullWith },

    className,
  )
}

function ButtonInner({ children, variant, size = 'large' }: ButtonProps & Pick<ButtonProps, 'children' | 'variant' | 'size'>) {
  return (
    <>
      <div
        className={clsx(` transform rounded-full   opacity-100  transition disabled:opacity-50`, {
          'border-2 border-button-outline bg-transparent ': variant === 'secondary' || variant === 'danger',
          danger: variant === 'danger',
          'shadow-md': variant === 'icon',
          'border-button-outline bg-button-primary': variant === 'primary',
          'border-button-successBg bg-success text-white': variant === 'payment',
        })}
      />

      <div
        className={clsx(`relative flex h-full w-full items-center justify-center whitespace-nowrap`, {
          'text-primary': variant === 'secondary',
          'text-white': variant === 'primary' || variant === 'payment',
          'text-red-500': variant === 'danger',
          'space-x-5 px-11 py-6 ': size === 'large',
          'space-x-3 px-8 py-4': size === 'medium',
          'space-x-1 px-5 py-2 text-sm ': size === 'small',
          'space-x-1 p-3 px-5 text-sm ': size === 'icon',
        })}
      >
        {children}
      </div>
    </>
  )
}

/**
 * Button component
 * NOTE - If use variant=custom you must pass a custom className and text white
 * @param {boolean} fullWith - If true, the button will take the full width of its parent
 * @param {string} variant - The variant of the button
 * @param {string} size - The size of the button
 * @param {string} className - The className of the button
 * @param {string} custom - The custom className of the button
 * @param {React.ReactNode} children - The children of the button
 * @param {string} to - The link of the button
 * @param {function} onClick - The onClick function of the button
 */

function Buttosn({
  children,
  fullWith,
  variant = 'primary',
  size = 'large',
  className,
  custom,
  ...buttonProps
}: ButtonProps & JSX.IntrinsicElements['button']) {
  return (
    <button {...buttonProps} className={getClassName({ className, fullWith })}>
      <ButtonInner variant={variant} size={size} custom={custom}>
        {children}
      </ButtonInner>
    </button>
  )
}

function Button({
  children,
  variant = 'primary',
  size = 'large',
  className,
  ...buttonProps
}: ButtonProps & JSX.IntrinsicElements['button']) {
  return (
    <button {...buttonProps} className={getClassName({ className })}>
      <ButtonInner variant={variant} size={size}>
        {children}
      </ButtonInner>
    </button>
  )
}

function LinkButton({
  children,
  fullWith,
  variant = 'primary',
  size = 'large',
  className,
  custom,
  to = '/',
  onClick,
}: LinkProps & JSX.IntrinsicElements['button']) {
  return (
    <Link onClick={onClick} to={to} preventScrollReset className={getClassName({ className, fullWith })}>
      <ButtonInner variant={variant} size={size} custom={custom}>
        {children}
      </ButtonInner>
    </Link>
  )
}

/**
 * A link that looks like a button
 */
// const ButtonLink = React.forwardRef<HTMLAnchorElement, React.ComponentPropsWithRef<typeof AnchorOrLink> & ButtonProps>(function ButtonLink(
//   { children, variant = 'primary', className, size = 'large', fullWith, ...rest },
//   ref,
// ) {
//   return (
//     <AnchorOrLink ref={ref} className={getClassName({ className, fullWith })} {...rest}>
//       <ButtonInner variant={variant} size={size}>
//         {children}
//       </ButtonInner>
//     </AnchorOrLink>
//   )
// })

export { Button, LinkButton }
