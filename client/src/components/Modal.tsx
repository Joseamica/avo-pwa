// Modal.jsx
import React from 'react'

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end md:items-center" onClick={onClose}>
      <div
        className="bg-white w-full md:max-w-md mx-auto rounded-t-lg p-4 transform transition-transform duration-300"
        onClick={e => e.stopPropagation()}
      >
        {children}
        {/* <button className="mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={onClose}>
          Cerrar
        </button> */}
      </div>
    </div>
  )
}

export default Modal
