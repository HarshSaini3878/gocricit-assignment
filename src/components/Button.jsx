import React, { useState } from "react";
import { motion } from "framer-motion";

const Button = ({ onClick, children, isActive, icon: Icon, showColorPicker, onColorChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative">
      <motion.button
        onClick={() => {
          if (showColorPicker) setShowPicker(!showPicker);
          onClick();
        }}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
          isActive
            ? "bg-black text-yellow-400 border-2 border-yellow-400"
            : "bg-black text-white hover:bg-gray-800"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {Icon && <Icon className="w-5 h-5" />}
        {children}
      </motion.button>

      {/* Color Picker Dropdown */}
      {showColorPicker && showPicker && (
        <div className="absolute top-12 left-0 bg-white p-2 rounded-lg shadow-lg z-10">
          <input
            type="color"
            onChange={(e) => {
              onColorChange(e.target.value);
              setShowPicker(false);
            }}
            className="w-8 h-8 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};

export default Button;




