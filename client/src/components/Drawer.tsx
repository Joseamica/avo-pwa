import { motion, AnimatePresence } from 'framer-motion'
import CloseRounded from '@mui/icons-material/CloseRounded'

const drawerVariants = {
  hidden: { x: '-100%' },
  visible: { x: 0 },
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const Drawer = ({ isOpen, closeDrawer, children }: { isOpen: boolean; closeDrawer: () => void; children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={backdropVariants}
        transition={{ duration: 0.05 }} // Hace que la transición del fondo sea muy rápida
        className="fixed inset-0 z-50 flex"
        onClick={closeDrawer}
      >
        <motion.div className="fixed inset-0 bg-black/70" aria-hidden="true"></motion.div>
        <motion.div
          variants={drawerVariants}
          transition={{ duration: 0.3 }} // Mantiene una transición suave para el Drawer
          className="relative w-screen max-w-md bg-white shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          <button onClick={closeDrawer} className="p-4 place-self-end">
            <CloseRounded />
          </button>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)

export default Drawer
