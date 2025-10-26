"use client"

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { MobileMenu } from './components/MobileMenu'
import { PostcardScroller } from './components/Scroller'
import { Footer } from './components/Footer' 
import CartDrawer from "./components/cartdrawer";

const pixelFlowerImages = [
  '/pixel-rose.png', 
  '/pixel-sunflower.png',
  '/pixel-tulip.png',
  '/pixel-lily.png',
  '/pixel-hibiscus.png',
  '/pixel-daisy.png',
  '/pixel-sakura.png',
  '/pixel-lavender.png',
  '/pixel-orchid.png',
];

const getRandomFlowerImage = () => {
  const randomIndex = Math.floor(Math.random() * pixelFlowerImages.length);
  return pixelFlowerImages[randomIndex];
};

const cardDataBase = [ // Data dasar tanpa gambar bunga
  { id: 1, to: 'Jane Doe', from: 'John Doe', message: "Thinking of you today! Hope you're having a wonderful day." },
  { id: 2, to: 'Alex', from: 'Sarah', message: "Just wanted to send a little sunshine your way. Keep shining!" },
  { id: 3, to: 'Mom', from: 'The Kids', message: "We love you more than words can say! Thanks for everything." },
  { id: 4, to: 'Bestie', from: 'Your #1 Fan', message: "Remember that time...? Haha! Miss you loads, let's catch up soon." },
  { id: 5, to: 'Michael', from: 'Emily', message: "Wishing you all the best on your new adventure! Go get 'em!" },
  { id: 6, to: 'Luna', from: 'Leo', message: "Saw this and thought of you. Hope it brings a smile to your face." },
  { id: 7, to: 'Grandma', from: 'Your Fav', message: "Sending you lots of love and hugs from afar! Stay warm." },
  { id: 8, to: 'Mr. Smith', from: 'Class 5B', message: "Thank you for being such an inspiring teacher! We appreciate you." },
  { id: 9, to: 'David', from: 'Chloe', message: "Happy Birthday! Hope you have a fantastic day filled with joy." },
  { id: 10, to: 'The Team', from: 'The Boss', message: "Great job on the project! Your hard work is truly valued." },
  { id: 11, to: 'My Love', from: 'Secret Admirer', message: "Just a little note to say you're always on my mind." },
  { id: 12, to: 'Future Me', from: 'Past Me', message: "Don't forget to stop and smell the roses sometimes. You got this!" },
];

function shuffleArray(array) {
  let currentIndex = array.length, randomIndex;
  const newArray = [...array]; 
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex]];
  }
  return newArray;
}

const createCardData = (baseData) => {
    return baseData.map(card => ({
        ...card,
        flowerImage: getRandomFlowerImage()
    }));
};

// ----- HALAMAN UTAMA -----
export default function Home() {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const [isClient, setIsClient] = useState(false);

  const [originalCards, setOriginalCards] = useState([]);
  const [shuffledCards, setShuffledCards] = useState([]);

  useEffect(() => {
    const initialCards = createCardData(cardDataBase);
    setOriginalCards(initialCards);
    setShuffledCards(shuffleArray(initialCards));
  }, []);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2500); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const cartKey = user ? `cart_${user.email}` : "cart_guest";

    const saved = localStorage.getItem(cartKey);
    if (saved) setCartItems(JSON.parse(saved));

    setInitialized(true); 
  }, []);

  useEffect(() => {
    if (!initialized) return; 
    const user = JSON.parse(localStorage.getItem("user"));
    const cartKey = user ? `cart_${user.email}` : "cart_guest";

    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, initialized]);

  useEffect(() => {
    if (!isClient) return; 

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.email) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Error parsing user:", err);
        setIsLoggedIn(false);
        localStorage.removeItem("user");
      }
    } else {
      setIsLoggedIn(false);
    }

    if (!isClient) return null;

    const handleScroll = () => {
      const homeSection = document.getElementById('home');
      const postcardSection = document.getElementById('postcard');
      const contactSection = document.getElementById('contact');
      const scrollPosition = window.scrollY + 120;
      const atBottom = window.scrollY + window.innerHeight >= document.body.offsetHeight - 20;

      if (atBottom && contactSection) {
        setActiveSection('contact');
      } else if (postcardSection && scrollPosition >= postcardSection.offsetTop) {
        setActiveSection('postcard');
      } else if (homeSection && scrollPosition >= homeSection.offsetTop) {
        setActiveSection('home');
      } else {
        setActiveSection('home');
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient]);


  if (showIntro)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#FFF7FC] to-[#FCE4EC] overflow-hidden relative">
      <div className="absolute inset-0 opacity-30">
        <Image
          src="/lily.png"
          alt="Background lily"
          fill
          className="object-cover blur-sm scale-105"
          priority
        />
      </div>

      {/* Logo / Judul */}
      <h1 className="font-caslon text-6xl sm:text-7xl text-[#451900] tracking-widest opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
        Lunaria
      </h1>

      {/* Subtext */}
      <p className="mt-4 font-dm text-lg text-[#6B4C43] opacity-0 animate-[fadeIn_1s_ease-out_0.5s_forwards]">
        Find your destined flower...
      </p>

      <style jsx global>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );


  return (
    <> 
      <main
        className={`relative min-h-screen overflow-x-hidden z-10
          ${isMenuOpen ? 'overflow-hidden' : ''}
        `}
      >
        <MobileMenu
          isOpen={isMenuOpen}
          setMenuOpen={setMenuOpen}
          activeSection={activeSection}
        />

        <Header
          setMenuOpen={setMenuOpen}
          activeSection={activeSection}
          isLoggedIn={isLoggedIn} 
          onCartClick={() => setCartOpen(true)}
          isMenuOpen={isMenuOpen} 
        />

        {/* Gambar Bunga Lily */}
        <div className="hidden lg:block absolute lg:top-[70px] lg:right-[-300px] lg:w-[855px] lg:h-[570px] -z-0">
          <Image
            src="/lily.png"
            alt="Blooming Lily"
            width={855}
            height={570}
            className="transform -rotate-45 opacity-95"
            priority
          />
        </div>

        {/* Hero Section */}
        <section
          id="home"
          className="relative z-0 pt-32 lg:pt-40 px-6 lg:px-0 lg:pl-28 max-w-full lg:max-w-4xl flex flex-col items-center lg:items-start"
        >
          <h1 className="font-caslon text-6xl md:text-7xl lg:text-9xl tracking-[0.15em] text-center lg:text-left">
            Lunaria
          </h1>
          <p className="font-dm font-medium text-base text-center lg:text-left max-w-2xl mt-6">
            At Lunaria, every flower is crafted with love and meaning. We believe
            each petal tells a story — from the passionate red rose to the calming
            scent of lavender. Discover our wide collection of fresh bouquets,
            custom floral arrangements, and elegant decorations for every special
            moment — birthdays, weddings, thank-you gifts, or simply to brighten
            your day.
          </p>
          <div className="flex flex-row flex-wrap gap-5 mt-12 font-dm font-medium justify-center lg:justify-start">
            <a 
            href="/shop"
            className="px-10 py-3 text-base bg-button-bg rounded-2xl text-black transition-transform duration-300 ease-out shadow-md hover:shadow-lg hover:-translate-y-1">
              Our Product
            </a>
            <a 
            href="#contact" 
            className="px-10 py-3 text-base bg-button-bg rounded-2xl text-black text-center transition-transform duration-300 ease-out shadow-md hover:shadow-lg hover:-translate-y-1"
           >
              Our Contact
            </a>
          </div>
        </section>

        {/* Scroller Section */}
        <section
          id="postcard"
          className="relative flex flex-col gap-8 mt-32 lg:mt-48 py-10 scroll-m-24 lg:scroll-m-28"
        >
          <PostcardScroller direction="left" cards={originalCards} />
          <PostcardScroller direction="right" cards={shuffledCards} />
        </section>
          <Footer /> 

          {isCartOpen && (
          <CartDrawer
            cartItems={cartItems}
            onClose={() => setCartOpen(false)}
            onUpdateQty={(id, qty, extra = {}) =>
              setCartItems((prev) =>
                prev.map((item) =>
                  item.id === id ? { ...item, qty, ...extra } : item
                )
              )
            }
            onRemove={(id) =>
              setCartItems((prev) => prev.filter((item) => item.id !== id))
            }
          />
        )}

      </main>

    </>
  )
}