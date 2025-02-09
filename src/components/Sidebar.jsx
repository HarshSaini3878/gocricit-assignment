"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";

const scanData = {
  "2025-02-08": [
    {
      image_url: "/xray.jpg",
      title: "MRI Brain Scan",
      date: "2025-02-08",
      time: "10:30 AM",
      patient: {
        name: "John Doe",
        sex: "Male",
        age: 45,
      },
    },
    {
      image_url: "/hand.jpg",
      title: "Chest X-ray",
      date: "2025-02-08",
      time: "02:15 PM",
      patient: {
        name: "Jane Smith",
        sex: "Female",
        age: 38,
      },
    },
  ],
  "2025-02-07": [
    {
      image_url: "/hand.jpg",
      title: "CT Abdomen Scan",
      date: "2025-02-07",
      time: "09:45 AM",
      patient: {
        name: "Robert Brown",
        sex: "Male",
        age: 52,
      },
    },
    {
      image_url: "/xray.jpg",
      title: "Ultrasound Kidney",
      date: "2025-02-07",
      time: "03:20 PM",
      patient: {
        name: "Emily Davis",
        sex: "Female",
        age: 29,
      },
    },
  ],
  "2025-02-06": [
    {
      image_url: "/hand.jpg",
      title: "MRI Spine Scan",
      date: "2025-02-06",
      time: "11:10 AM",
      patient: {
        name: "Michael Johnson",
        sex: "Male",
        age: 60,
      },
    },
  ],
};


export default function Sidebar({ setSelectedImage }) {
  const [openDate, setOpenDate] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleDropdown = (date) => {
    setOpenDate(openDate === date ? null : date);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-zinc-800 rounded-lg text-white hover:bg-zinc-700 transition duration-300"
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -288 }} // Start off-screen
        animate={{ x: isSidebarOpen ? 0 : -288 }} // Slide in/out
        transition={{ type: "tween", duration: 0.3 }} // Smooth transition
        className="fixed top-0 left-0 w-72 h-screen bg-zinc-900 text-white overflow-y-auto border-r-1 border-zinc-900 font-Tinos z-40"
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-6 flex items-center font-roboto">
            <span className="mr-2">🩻</span> Patient Scans
          </h2>
          <ul className="space-y-4">
            {Object.entries(scanData).map(([date, scans]) => (
              <li key={date} className="rounded-lg border-zinc-600 border-1 overflow-hidden">
                <button
                  onClick={() => toggleDropdown(date)}
                  className="w-full text-left p-3 bg-zinc-800 hover:bg-zinc-700 transition duration-300 flex justify-between items-center"
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
                      className="bg-zinc-800"
                    >
                      {scans.map((scan, index) => (
                        <div
                          key={index}
                          className="p-3 min-h-10 border-t border-zinc-700 cursor-pointer hover:bg-zinc-700 transition flex items-center"
                          onClick={() => setSelectedImage(scan)}
                        >
                          <img
                            src={scan.image_url || "/placeholder.svg"}
                            alt={scan.title}
                            className="w-16 h-16 object-cover rounded mr-4"
                          />
                          <div>
                            <p className="text-sm font-medium">{scan.title}</p>
                            <p className="text-xs text-zinc-400">
                              {scan.date} | {scan.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </>
  );
}