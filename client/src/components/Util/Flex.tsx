const align_items = {
  center: 'items-center',
  start: 'items-start',
  end: 'items-end',
}

const spacer = {
  xs: { x: 'space-x-2', y: 'space-y-2' },
  sm: { x: 'space-x-3', y: 'space-y-3' },
  md: { x: 'space-x-4', y: 'space-y-4' },
  lg: { x: 'space-x-6', y: 'space-y-6' },
  xl: { x: 'space-x-8', y: 'space-y-8' },
}
const directions = {
  row: 'flex-row',
  col: 'flex-col',
}

/**
 * Renders a flexible container with customizable direction, alignment, and spacing.
 *
 * @param {object} props - The component props.
 * @param {('row' | 'col')} props.direction - The direction of the flex container. Defaults to 'row'.
 * @param {string} props.className - Additional CSS class names for the flex container.
 * @param {React.ReactNode} props.children - The content to be rendered inside the flex container.
 * @param {keyof typeof align_items} props.align - The alignment of the flex items. See `align_items` for available options.
 * @param {keyof typeof spacer} props.space - The spacing between flex items. See `spacer` for available options.
 * @returns {JSX.Element} The rendered flex container.
 */
function Flex({
  direction = 'row',
  className = '',
  children,
  align,
  space,
}: {
  direction?: 'row' | 'col'
  className?: string
  children?: React.ReactNode
  align?: keyof typeof align_items
  space?: keyof typeof spacer
}) {
  const spacingStyle = direction === 'row' ? spacer[space]?.x : spacer[space]?.y

  return <div className={`flex ${directions[direction]} ${align_items[align]} ${spacingStyle} ${className}`}>{children}</div>
}

export { Flex }
