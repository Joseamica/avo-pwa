export default function ErrorParagraph({ message }: { message: string }) {
  return <div className="flex justify-center p-2 my-2 text-texts-error rounded-xl bg-background-error ">{message}</div>
}
