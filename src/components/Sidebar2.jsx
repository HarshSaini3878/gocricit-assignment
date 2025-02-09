

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronRight, ChevronLeft } from "lucide-react"

const Sidebar2 = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      className="fixed right-0 top-0 h-full bg-zinc-800 shadow-lg z-50 border-l-1 border-zinc-700 "
      initial={{ width: "60px" }}
      animate={{ width: isOpen ? "300px" : "20px" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full border-l-1 border-zinc-700 border-y-1 text-white py-1 px-0.5  sm:p-2 rounded-l-md"
      >
        {isOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
      <div className="h-full overflow-y-auto p-4">
        <motion.div animate={{ opacity: isOpen ? 1 : 0 }} transition={{ duration: 0.2 }}>
          {children}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Sidebar2

