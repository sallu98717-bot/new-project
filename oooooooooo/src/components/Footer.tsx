import React from 'react'

function Footer() {
  return (
    <div>
        <footer className="bg-[#ae265f] text-white py-12 mt-12">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Credit Cards Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Credit Cards</h3>
        <ul className="space-y-2">
          <li><a href="#" className="hover:underline">Travel Cards</a></li>
          <li><a href="#" className="hover:underline">Shopping Cards</a></li>
          <li><a href="#" className="hover:underline">Fuel Cards</a></li>
          <li><a href="#" className="hover:underline">Premium Cards</a></li>
        </ul>
      </div>

      {/* Contact Us Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
        <ul className="space-y-2">
          <li><a href="#" className="hover:underline">Service Request</a></li>
          <li><a href="#" className="hover:underline">Helpline Number</a></li>
          <li><a href="#" className="hover:underline">Locate Us</a></li>
          <li><a href="#" className="hover:underline">Grievance Redressal</a></li>
        </ul>
      </div>

      {/* Useful Links Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Useful Links</h3>
        <ul className="space-y-2">
          <li><a href="#" className="hover:underline">Training Centre</a></li>
          <li><a href="#" className="hover:underline">Home Buyer's Guide</a></li>
          <li><a href="#" className="hover:underline">FAQs</a></li>
          <li><a href="#" className="hover:underline">Blogs</a></li>
        </ul>
      </div>

      {/* Card Services Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Card Services</h3>
        <ul className="space-y-2">
          <li><a href="#" className="hover:underline">Card Activation</a></li>
          <li><a href="#" className="hover:underline">Block Your Card</a></li>
          <li><a href="#" className="hover:underline">Generate PIN</a></li>
          <li><a href="#" className="hover:underline">Application Status</a></li>
        </ul>
      </div>
    </div>

    {/* Copyright Section */}
    <div className="border-t border-white/20 mt-8 pt-8 text-center">
      <p className="text-sm">© 2025 Arts Bank Online. This is a conceptual design. All rights reserved.</p>
    </div>
  </div>
</footer>
    </div>
  )
}

export default Footer
