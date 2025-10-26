// src/app/components/Header.js
import { useState, useEffect, useRef } from 'react';
import { BsCart, BsPerson } from 'react-icons/bs';
import { HiOutlineMenu } from 'react-icons/hi';
import { ProfileDropdown } from './ProfileDropdown';

// Helper function capitalize
const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// Terima prop isMenuOpen
export function Header({ setMenuOpen, activeSection, isLoggedIn, onCartClick, isMenuOpen }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // useEffect untuk klik di luar dropdown (biarkan nonaktif jika sebelumnya fix)
  /* useEffect(() => { ... }); */

  // --- DEBUGGING: Buat fungsi terpisah ---
  const handleHamburgerClick = () => {
    console.log("Hamburger clicked. Current isMenuOpen state:", isMenuOpen);
    setMenuOpen(!isMenuOpen); // Ini harusnya toggle state di page.js
  };
  // --- AKHIR DEBUGGING ---

  return (
    // Header utama transparan
    <header className="fixed top-0 left-0 lg:top-6 lg:left-1/2 lg:-translate-x-1/2 z-50 w-full max-w-6xl px-4 pt-6 lg:pt-0">
      <nav className="flex items-center w-full">
        {/* --- TAMPILAN DESKTOP --- */}
        <div className="hidden lg:flex items-center justify-center gap-12 px-20 py-5 rounded-full shadow-lg bg-white/30 backdrop-blur-md">
           {/* ... Link Navigasi Desktop ... */}
           <a
            href="/#home"
            className={`font-dm font-semibold text-lg ${
              activeSection === 'home' ? 'text-black' : 'text-black/40'
            }`}
          >
            Home
          </a>
          <a
            href="/shop"
            className={`font-dm font-semibold text-lg ${
              activeSection === 'shop' ? 'text-black' : 'text-black/40'
            }`}
          >
            Shop
          </a>
          <a
            href="/#postcard"
            className={`font-dm font-semibold text-lg ${
              activeSection === 'postcard' ? 'text-black' : 'text-black/40'
            }`}
          >
            Postcard
          </a>
          <a
            href="#contact"
            className={`font-dm font-semibold text-lg ${
              activeSection === 'contact' ? 'text-black' : 'text-black/40'
            }`}
          >
            Contact
          </a>
        </div>
        {/* Kanan Desktop */}
        <div className="hidden lg:flex items-center justify-center gap-12 px-10 py-4 rounded-full ml-auto shadow-lg bg-white/30 backdrop-blur-md">
          <button onClick={onCartClick} className="text-zinc-800 hover:text-pink-600 transition-colors">
            <BsCart className="w-[26px] h-[26px]" />
          </button>
          <div className="relative" ref={dropdownRef}>
             <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-zinc-800 hover:text-pink-600 transition-colors flex items-center"
            >
              <BsPerson className="w-[26px] h-[26px]" />
            </button>
            {isDropdownOpen && (
              <ProfileDropdown
                isLoggedIn={isLoggedIn}
                onClose={() => setIsDropdownOpen(false)}
              />
            )}
          </div>
        </div>

        {/* --- TAMPILAN MOBILE --- */}
        <div className="flex lg:hidden items-center justify-between w-full max-w-sm mx-auto px-6 py-4 rounded-full shadow-lg bg-white/30 backdrop-blur-md"> {/* <-- Background dikembalikan */}
           {/* Panggil fungsi handleHamburgerClick */}
           <button onClick={handleHamburgerClick} className="p-1 text-zinc-800 hover:text-pink-600 transition-colors">
             <HiOutlineMenu className="w-6 h-6" />
           </button>
           <span className="font-dm font-semibold text-base text-black">
             {capitalize(activeSection)}
           </span>
           <div className="flex items-center gap-6">
              <button onClick={onCartClick} className="text-zinc-800 hover:text-pink-600 transition-colors">
                 <BsCart className="w-[22px] h-[22px]" />
              </button>
              <div className="relative" ref={dropdownRef}>
                 <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-zinc-800 hover:text-pink-600 transition-colors flex items-center"
                >
                  <BsPerson className="w-[22px] h-[22px]" />
                </button>
                {isDropdownOpen && (
                  <ProfileDropdown
                      isLoggedIn={isLoggedIn}
                      onClose={() => setIsDropdownOpen(false)}
                  />
                )}
              </div>
            </div>
         </div>
      </nav>
    </header>
  );
}