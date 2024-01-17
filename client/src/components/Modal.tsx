// Modal.jsx
import { Dialog, Transition } from '@headlessui/react'
import { CloseRounded } from '@mui/icons-material'
import { Fragment } from 'react'

/**
 * Modal component that displays a dialog box with a title, description, and content.
 *  https://headlessui.com/react/dialog
 * @param isOpen - Determines whether the modal is open or closed.
 * @param closeModal - Function to close the modal.
 * @param children - The content to be displayed inside the modal.
 * @param title - The title of the modal.
 * @param description - The description of the modal.
 * @param scrollable - Optional. Determines whether the modal content is scrollable.
 * @returns The Modal component.
 */

const Modal = ({
  isOpen,
  closeModal,
  children,
  title,
  description,
  scrollable,
}: {
  isOpen: boolean
  closeModal: () => void
  children: React.ReactNode
  title: string
  description?: string
  scrollable?: boolean
}) => {
  if (!isOpen) return null

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

        <div className={`fixed inset-x-0 bottom-0 ${scrollable === true ? 'overflow-y-auto' : null}`}>
          <div className="flex items-center justify-center min-h-full text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-full scale-95"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-full scale-95"
            >
              <Dialog.Panel className="w-full overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-t-2xl">
                <Dialog.Title
                  as="div"
                  className="sticky flex justify-between w-full p-4 text-xl font-medium leading-6 text-gray-900 border"
                >
                  <div />
                  <h3 className="">{title}</h3>
                  <button onClick={closeModal}>
                    <CloseRounded className="self-end" />
                  </button>
                </Dialog.Title>
                <div className="px-5 my-2">
                  <Dialog.Description className="mt-2 text-sm text-gray-500">{description}</Dialog.Description>

                  <div>{children}</div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Modal
