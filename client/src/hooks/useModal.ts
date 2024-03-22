import { useReducer } from 'react'

type ModalType = 'MODAL' | 'INNER_MODAL' | 'INNER_INNER_MODAL' // Se pueden añadir más niveles si es necesario
type ModalAction = {
  type: 'OPEN_MODAL' | 'CLOSE_MODAL' | 'CLOSE_MULTIPLE_MODALS'
  modalKey: string
  modalType?: ModalType
  modalKeys?: string[]
}

type ModalState = Record<string, boolean>

const initialState: ModalState = {}

function modalReducer(state: ModalState, action: ModalAction): ModalState {
  const newState = { ...state }

  switch (action.type) {
    case 'OPEN_MODAL':
      if (action.modalKey) {
        return { ...state, [action.modalKey]: true }
      }
      return state
    case 'CLOSE_MODAL':
      if (action.modalKey) {
        return { ...state, [action.modalKey]: false }
      }
      return state
    case 'CLOSE_MULTIPLE_MODALS':
      action.modalKeys?.forEach(key => {
        if (key in newState) {
          newState[key] = false
        }
      })
      return newState
    default:
      return state
  }
}
function useModal() {
  const [state, dispatch] = useReducer(modalReducer, initialState)

  const openModal = (modalKey: string) => dispatch({ type: 'OPEN_MODAL', modalKey })
  const closeModal = (modalKey: string) => dispatch({ type: 'CLOSE_MODAL', modalKey })
  const closeMultipleModals = (modalKeys: string[]) => dispatch({ type: 'CLOSE_MULTIPLE_MODALS', modalKey: '', modalKeys })

  return { modalState: state, openModal, closeModal, closeMultipleModals }
}

export default useModal
