import React from 'react';

const Navbar = ({ scrollToSection }) => {
  return (
    <header className="bg-white shadow-md py-4 fixed w-full top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-full mr-3"></div> {/* Placeholder logo */}
          <h1 className="text-xl font-bold text-gray-800">My Website</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><button onClick={() => scrollToSection('projects')} className="text-gray-600 hover:text-indigo-600">Projects</button></li>
            <li><button onClick={() => scrollToSection('clients')} className="text-gray-600 hover:text-indigo-600">Clients</button></li>
            <li><button onClick={() => scrollToSection('contact-us')} className="text-gray-600 hover:text-indigo-600">Contact Us</button></li>
            <li><button onClick={() => scrollToSection('newsletter')} className="text-gray-600 hover:text-indigo-600">Newsletter</button></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
