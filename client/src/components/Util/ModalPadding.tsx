export default function ModalPadding({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`py-6 px-4  ${className}`}>{children}</div>
}
