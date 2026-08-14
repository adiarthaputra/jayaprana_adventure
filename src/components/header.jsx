import React, { useState } from 'react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false); // Close menu on mobile after click
  };

  return (
    <header className="bg-primary-blue text-primary-white p-4 sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Jayaprana Adventure</h1>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}></path>
            </svg>
          </button>
        </div>
        <ul className={`md:flex md:space-x-4 ${isOpen ? 'block' : 'hidden'} md:block absolute md:static top-16 left-0 right-0 bg-primary-blue md:bg-transparent p-4 md:p-0`}>
          <li><button onClick={() => scrollToSection('home')} className="block py-2 md:py-0 hover:underline">Home</button></li>
          <li><button onClick={() => scrollToSection('about')} className="block py-2 md:py-0 hover:underline">About Us</button></li>
          <li><button onClick={() => scrollToSection('gallery')} className="block py-2 md:py-0 hover:underline">Galerry</button></li>
          <li><button onClick={() => scrollToSection('testimonials')} className="block py-2 md:py-0 hover:underline">Testimoni</button></li>
          <li><button onClick={() => scrollToSection('package')} className="block py-2 md:py-0 hover:underline">Package</button></li>
          <li><button onClick={() => scrollToSection('faq')} className="block py-2 md:py-0 hover:underline">FAQ</button></li>
          <li><button onClick={() => scrollToSection('address')} className="block py-2 md:py-0 hover:underline">Our Address</button></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;