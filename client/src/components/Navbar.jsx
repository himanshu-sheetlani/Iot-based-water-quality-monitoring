import React from "react";
import { History, Settings } from "lucide-react"; 

const Navbar = () => {
  return (
    <nav className="w-full bg-[#000] text-white flex items-center justify-between px-6 py-3 border-b border-gray-800 shadow-sm sticky top-0 z-50">

      <div className="flex items-center space-x-2">
        <a href="/" className="flex items-center">
            <img
              src="https://i.ibb.co/Q7yGR6Ny/1.png" 
              alt="HydroWatch Logo"
              className="h-8 w-8"
            />
            <h2 className="text-xl text-cyan-600 font-bold tracking-wide p-2">HydroWatch</h2>
        </a>
      </div>
      <div className="flex items-center space-x-6">
        <a href="/report">
            <button
              className="flex items-center gap-1 text-gray-300 hover:text-blue-400 transition"
              title="History"
            >
              <History className="h-5 w-5" />
              <span className="hidden sm:inline text-sm font-medium">Reports</span>
            </button>
        </a>

        <a href="/setting">
            <button
              className="flex items-center gap-1 text-gray-300 hover:text-blue-400 transition"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
              <span className="hidden sm:inline text-sm font-medium">Settings</span>
            </button>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
