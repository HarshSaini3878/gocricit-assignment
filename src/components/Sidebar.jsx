"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"

const scanData = {
  "2025-02-08": [
    {
      image_url: "src/assets/xray.jpg",
      title: "MRI Brain Scan",
    },
    {
      image_url: "src/assets/hand.jpg",
      title: "Chest X-ray",
    },
  ],
  "2025-02-07": [
    {
      image_url: "src/assets/hand.jpg",
      title: "CT Abdomen Scan",
    },
    {
      image_url: "src/assets/xray.jpg",
      title: "Ultrasound Kidney",
    },
  ],
  "2025-02-06": [
    {
      image_url: "src/assets/hand.jpg",
      title: "MRI Spine Scan",
    },
  ],
}

export default function PatientScansSidebar({ setSelectedImage }) {
    const [openDate, setOpenDate] = useState(null);
  
    const toggleDropdown = (date) => {
      setOpenDate(openDate === date ? null : date);
    };
  
    return (
      <div className="w-64 bg-black text-white h-screen p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="mr-2">🩻</span> Patient Scans
        </h2>
        <ul className="space-y-4">
          {Object.entries(scanData).map(([date, scans]) => (
            <li key={date} className="rounded-lg overflow-hidden">
              <button
                onClick={() => toggleDropdown(date)}
                className="w-full text-left p-3 bg-gray-900 hover:bg-gray-800 transition duration-300 flex justify-between items-center"
              >
                <span>{date}</span>
                {openDate === date ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              <AnimatePresence>
                {openDate === date && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-800"
                  >
                    {scans.map((scan, index) => (
                      <div
                        key={index}
                        className="p-3 border-t border-gray-700 cursor-pointer hover:bg-gray-700 transition"
                        onClick={() => setSelectedImage(scan.image_url)}
                      >
                        <div className="relative pb-[56.25%]">
                          <img
                            src={scan.image_url || "/placeholder.svg"}
                            alt={scan.title}
                            className="absolute top-0 left-0 w-full h-full object-cover rounded"
                          />
                        </div>
                        <p className="text-sm mt-2 font-medium">{scan.title}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
