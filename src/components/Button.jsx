"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const Button = ({ onClick, children, isActive, icon: Icon, showColorPicker, onColorChange }) => {
  const [showPicker, setShowPicker] = useState(false)

  return (
    <div className="relative font-Tinos w-full">
      <motion.button
        onClick={() => {
          if (showColorPicker) setShowPicker(!showPicker)
          onClick()
        }}
        className={`w-full px-3 sm:px-4 md:px-5 lg:px-7 py-2 sm:py-2 md:py-3 lg:py-4 rounded-lg text-xs sm:text-sm md:text-base lg:text-base font-medium transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-5  ${
          isActive
            ? "bg-yellow-200/50 border-2 border-yellow-500 text-yellow-500/60"
            : "bg-zinc-900 text-white hover:text-zinc-950 hover:bg-white"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          boxShadow: isActive ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
        }}
      >
        {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 flex-shrink-0" />}
        <span className="truncate">{children}</span>
      </motion.button>

      {/* Color Picker Dropdown */}
      {showColorPicker && showPicker && (
        <div className="absolute top-full left-0 mt-2 bg-white p-2 rounded-lg shadow-lg z-10">
          <input
            type="color"
            onChange={(e) => {
              onColorChange(e.target.value)
              setShowPicker(false)
            }}
            className="w-8 h-8 cursor-pointer"
          />
        </div>
      )}
    </div>
  )
}

export default Button