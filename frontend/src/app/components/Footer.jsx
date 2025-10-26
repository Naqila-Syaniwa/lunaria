"use client"; 

import { useState, useEffect } from 'react'; 
import { BsInstagram, BsPinterest, BsTwitter } from 'react-icons/bs';
import Image from 'next/image';

export function Footer() {
  const [currentYear, setCurrentYear] = useState('');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
     }, []);   
    return (
    <footer
      id="contact"
      className="relative w-full py-20 px-6 bg-transparent mt-40 scroll-m-32 lg:scroll-m-40 overflow-hidden"
    >
      {/* BUNGA KIRI (Bouquet 1) */}
      <div className="hidden lg:block absolute bottom-0 left-0 w-[625px] h-[625px] -ml-[210px] -mb-[180px] rotate-[30deg] z-0">
        <Image
          src="/bouquet1.png"
          alt="Left Bouquet"
          fill
          className="object-contain"
        />
      </div>

      {/* BUNGA KANAN (Bouquet 2) */}
      <div className="hidden lg:block absolute bottom-0 right-0 w-[650px] h-[650px] -mr-[240px] -mb-[200px] -rotate-[40deg] z-0">
        <Image
          src="/bouquet2.png"
          alt="Right Bouquet"
          fill
          className="object-contain scale-x-[-1]"
        />
      </div>

      <div className="relative max-w-4xl mx-auto flex flex-col items-center gap-8 z-10">
        {/* 1. Brand Name */}
        <h2 className="font-caslon text-5xl tracking-[0.1em] text-center">
          Lunaria
        </h2>

        {/* 2. Nav Links */}
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 font-dm text-base text-black/80">
          <a href="/#home" className="hover:text-black transition-colors">
            Home
          </a>
          <a href="/shop" className="hover:text-black transition-colors">
            Shop
          </a>
          <a href="/#postcard" className="hover:text-black transition-colors">
            Postcard
          </a>
          <a href="/#contact" className="hover:text-black transition-colors">
            Contact
          </a>
        </nav>

        {/* 3. Social Icons */}
        <div className="flex gap-6">
          <a href="#" aria-label="Instagram">
            <BsInstagram className="w-6 h-6 text-black/70 hover:text-black transition-colors" />
          </a>
          <a href="#" aria-label="Pinterest">
            <BsPinterest className="w-6 h-6 text-black/70 hover:text-black transition-colors" />
          </a>
          <a href="#" aria-label="Twitter">
            <BsTwitter className="w-6 h-6 text-black/70 hover:text-black transition-colors" />
          </a>
        </div>

        {/* 4. Copyright */}
        <p className="text-sm text-black/60 mt-8 text-center">
          © {new Date().getFullYear()} Lunaria. Crafted with love and meaning.
        </p>
      </div>
    </footer>
  )
}