import clsx from 'clsx'
import React from 'react'
import { Link } from 'react-router-dom'

function InnerButton({
  children,
  variant,
  size = 'lg',
  className,
}: {
  children: React.ReactNode | React.ReactNode[]
  variant?: 'primary' | 'secondary' | 'danger' | 'icon' | 'payment' | 'custom'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  className?: string
} & Pick<ButtonProps, 'children' | 'variant' | 'size'>) {
  return (
    <>
      <div
        className={clsx(
          'flex items-center disabled:bg-buttons-disabled disabled:border-0 justify-center  px-10 py-5 ',
          { 'bg-buttons-main border-4 border-borders-button text-white rounded-2xl text-xl': variant === 'primary' },
          { 'bg-white border-4 border-borders-button text-buttons-main rounded-2xl text-xl': variant === 'secondary' },
          { 'bg-buttons-main border-4 border-borders-button text-white rounded-2xl text-xl': variant === 'danger' },

          className,
        )}
      />
      <div
        className={clsx(`relative flex h-full w-full items-center justify-center whitespace-nowrap`, {
          'text-primary': variant === 'secondary',
          'text-white': variant === 'primary' || variant === 'payment',
          'text-red-500': variant === 'danger',
          'px-11 py-6 ': size === 'lg',
          'space-x-3 px-8 py-4': size === 'md',
          'space-x-1 px-5 py-2 text-sm ': size === 'sm',
        })}
      >
        {children}
      </div>
    </>
  )
}

const IconButton = ({
  icon,
  text,
  onClick,
  className,
}: {
  icon: React.ReactNode
  text: string
  onClick: () => void
  className?: string
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center justify-between w-full px-10 py-5 text-white bg-buttons-main border-4 border-borders-button rounded-2xl',
        className,
      )}
    >
      <span className="flex justify-start ">{icon}</span>
      <span className="flex justify-center text-xl ">{text}</span>
      <span className="flex "></span> {/* Espacio invisible */}
    </button>
  )
}

export function Button({
  text,
  size = 'lg',
  className,
  variant = 'primary',
  ...buttonProps
}: { text: string; className?: string; variant?: string; size?: string } & JSX.IntrinsicElements['button']) {
  return (
    <button
      {...buttonProps}
      className={clsx(
        'flex items-center disabled:bg-buttons-disabled disabled:border-4 justify-center w-full  text-white bg-buttons-main border-4 border-borders-button  rounded-2xl border-gray text-xl',
        { 'px-11 py-6 ': size === 'lg' },
        { 'px-8 py-4': size === 'md' },
        { ' px-5 py-2 ': size === 'sm' },
        className,
      )}
    >
      {/* <InnerButton> */}
      <span className={clsx('', { 'text-xl': size === 'lg' }, { 'text-lg': size === 'md' }, { 'text-base': size === 'sm' })}>{text}</span>
      {/* </InnerButton> */}
    </button>
  )
}

export function CounterButton({
  text,

  className,
  ...buttonProps
}: { text: string; className?: string } & JSX.IntrinsicElements['button']) {
  return (
    <button
      {...buttonProps}
      className={clsx(
        ' cursor-pointer flex box-border relative w-8 h-8  items-center disabled:bg-buttons-disabled disabled:border-0 justify-center   text-white bg-buttons-main border-2 border-borders-button  rounded-2xl text-xl',
        className,
      )}
    >
      {text}
    </button>
  )
}

interface ButtonProps {
  fullWith?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'icon' | 'payment' | 'custom'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode | React.ReactNode[]
  to?: string
  custom?: string
}

interface LinkProps {
  fullWith?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'icon' | 'payment' | 'custom'
  size?: 'sm' | 'md' | 'lg'
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

function ButtonInner({ children, variant, size = 'lg' }: ButtonProps & Pick<ButtonProps, 'children' | 'variant' | 'size'>) {
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
          'space-x-5 px-11 py-6 ': size === 'lg',
          'space-x-3 px-8 py-4': size === 'md',
          'space-x-1 px-5 py-2 text-sm ': size === 'sm',
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
  size = 'lg',
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

function Button2({ children, variant = 'primary', size = 'lg', className, ...buttonProps }: ButtonProps & JSX.IntrinsicElements['button']) {
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
  size = 'lg',
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
//   { children, variant = 'primary', className, size = 'lg', fullWith, ...rest },
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

export { Button2, LinkButton, IconButton }
