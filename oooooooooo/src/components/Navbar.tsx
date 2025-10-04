import React from 'react'
import { Triangle, Menu } from 'lucide-react'
import logo from '/assets/logo.png'


function Navbar() {
  return (
    <div>
      <header className="bg-[#ae265f] text-white px-4 py-3">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="h-14 w-15" />
          
           
          </div>
          <Menu className="h-6 w-6 cursor-pointer" />
        </div>
      </header>
    </div>
  )
}

export default Navbar
