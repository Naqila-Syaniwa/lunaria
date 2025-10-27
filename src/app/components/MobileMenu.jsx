export function MobileMenu({ isOpen, setMenuOpen, activeSection }) {
  return (
    <div
      className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-md lg:hidden
        transition-opacity duration-300
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
      onClick={() => setMenuOpen(false)} 
    >
      {/* Panel Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-page-bg shadow-2xl z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >

        <nav className="flex flex-col p-6 space-y-6 pt-28">
          <a
            href="/#home"
            className={`font-dm font-semibold text-2xl ${
              activeSection === 'home' ? 'text-black' : 'text-black/60'
            }`}
            onClick={() => setMenuOpen(false)} 
          >
            Home
          </a>
          <a
            href="/shop"
            className={`font-dm font-semibold text-2xl ${
              activeSection === 'shop' ? 'text-black' : 'text-black/60'
            }`}
             onClick={() => setMenuOpen(false)} 
          >
            Shop
          </a>
          <a
            href="/#postcard"
            className={`font-dm font-semibold text-2xl ${
              activeSection === 'postcard' ? 'text-black' : 'text-black/60'
            }`}
            onClick={() => setMenuOpen(false)} 
          >
            Postcard
          </a>
          <a
            href="#contact"
            className={`font-dm font-semibold text-2xl ${
              activeSection === 'contact' ? 'text-black' : 'text-black/60'
            }`}
            onClick={() => setMenuOpen(false)} 
          >
            Contact
          </a>
        </nav>
      </div>
    </div>
  )
}