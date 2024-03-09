// Modal.jsx
import { Dialog, Transition } from '@headlessui/react'
import CloseRounded from '@mui/icons-material/CloseRounded'
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
  isFullScreen,
  footer,
}: {
  isOpen: boolean
  closeModal: () => void
  children: React.ReactNode
  title?: string
  description?: string
  scrollable?: boolean
  isFullScreen?: boolean
  footer?: React.ReactNode
}) => {
  if (!isOpen) return null
  const modalContentMaxHeight = '100vh' // Adjust as needed

  const handleBackgroundClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    closeModal()
  }
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 " onClose={() => null} static>
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" onClick={e => handleBackgroundClick(e)} />

        <div className={`fixed inset-x-0 bottom-0    ${scrollable ? 'overflow-y-auto' : null}`}>
          <div className="flex items-center justify-center min-h-full text-center ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-full scale-95"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-full scale-95"
            >
              <div className={`fixed inset-x-0 bottom-0 max-w-lg mx-auto  ${scrollable ? 'overflow-hidden' : ''}`}>
                <Dialog.Panel
                  className={`w-full text-left align-middle transition-all transform flex flex-col   ${
                    isFullScreen ? 'fixed inset-0 bg-background-primary' : 'bg-background-primary shadow-xl rounded-t-3xl'
                  }`}
                  style={{ maxHeight: modalContentMaxHeight }}
                >
                  <Dialog.Title
                    as="div"
                    className="sticky top-0 z-10 flex justify-between w-full p-4 text-xl font-medium leading-6 text-gray-900 bg-white border rounded-t-3xl"
                  >
                    <div />
                    <h3 className="">{title}</h3>
                    <button onClick={closeModal}>
                      <CloseRounded className="self-end" />
                    </button>
                  </Dialog.Title>

                  <div className="flex-grow overflow-y-auto">
                    <Dialog.Description className="px-5 text-sm text-gray-500">{description}</Dialog.Description>
                    <div className="">{children}</div>
                  </div>

                  {footer && <div className="p-4 bg-white border-t rounded-t-xl">{footer}</div>}
                </Dialog.Panel>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Modal
