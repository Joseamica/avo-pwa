import { useReducer } from 'react'

type ModalType = 'MODAL' | 'INNER_MODAL' | 'INNER_INNER_MODAL' // Se pueden añadir más niveles si es necesario
type ModalAction = { type: 'OPEN_MODAL' | 'CLOSE_MODAL'; modalKey: string; modalType?: ModalType }
type ModalState = Record<string, boolean>

const initialState: ModalState = {}

function modalReducer(state: ModalState, action: ModalAction): ModalState {
  switch (action.type) {
    case 'OPEN_MODAL':
      return { ...state, [action.modalKey]: true }
    case 'CLOSE_MODAL':
      return { ...state, [action.modalKey]: false }
    default:
      return state
  }
}
function useModal() {
  const [state, dispatch] = useReducer(modalReducer, initialState)

  const openModal = (modalKey: string) => dispatch({ type: 'OPEN_MODAL', modalKey })
  const closeModal = (modalKey: string) => dispatch({ type: 'CLOSE_MODAL', modalKey })

  return { modalState: state, openModal, closeModal }
}

export default useModal
