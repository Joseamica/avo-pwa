export default function ModalPadding({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4  ${className}`}>{children}</div>
}
