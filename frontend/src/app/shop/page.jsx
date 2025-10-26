"use client";
import { useState, useEffect } from "react";
import Select from "react-select";
import Image from "next/image";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { MobileMenu } from '../components/MobileMenu'
import FlowerPopup from "../components/flowerpopup";
import CartDrawer from "../components/cartdrawer";
import { DM_Sans, Libre_Caslon_Display } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm",
});

const caslon = Libre_Caslon_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-caslon",
});

const sortOptions = [
  { value: "", label: "Sort" },
  { value: "harga-asc", label: "Lowest Price" },
  { value: "harga-desc", label: "Highest Price" },
  { value: "umur-asc", label: "Shortest Lifespan" },
  { value: "umur-desc", label: "Longest Lifespan" },
];

const availabilityOptions = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Out of Stock" },
];


export default function ShopPage() {
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [activeSection] = useState("shop");

  const [selectedSeason, setSelectedSeason] = useState("Spring");
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortOption, setSortOption] = useState("");
  const [selectedFlower, setSelectedFlower] = useState(null);
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setCartOpen] = useState(false);
   const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isClient) return;

    try {
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      setUser(parsedUser);

      const cartKey = parsedUser ? `cart_${parsedUser.email}` : "cart_guest";
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (err) {
      console.error("Error loading user/cart:", err);
      localStorage.removeItem("user");
    }
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const cartKey = parsedUser ? `cart_${parsedUser.email}` : "cart_guest";
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, isClient]);

  // Tambah ke keranjang
  const handleAddToCart = (flower) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === flower.id);
      if (existing) {
        return prev.map((item) =>
          item.id === flower.id
            ? { ...item, qty: item.qty + flower.qty }
            : item
        );
      } else {
        return [
          ...prev,
          { 
            ...flower, 
            qty: flower.qty || 1,
            to: "",
            message: "",
            isPublic: false,
          },
        ];
      }
    });
    setCartOpen(true);
  };

  // Ambil data dari backend
  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/flowers");
        if (!res.ok) throw new Error("Failed to fetch flowers");
        const data = await res.json();
        setFlowers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlowers();
  }, []);

  if (!isClient) return null;

  if (loading)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#FFF7FC] to-[#FCE4EC] relative overflow-hidden">

      {/* Logo / Judul */}
      <h1 className="relative z-10 font-caslon text-6xl sm:text-7xl text-[#451900] tracking-widest drop-shadow-lg">
        Lunaria
      </h1>

      {/* Subtext */}
      <p className="relative z-10 mt-4 font-dm text-lg text-[#6B4C43]">
        Blooming your flowers...
      </p>

      {/* Animasi Kelopak */}
      <div className="relative mt-8 flex space-x-2">
        <div className="w-3 h-3 bg-[#CA217C] rounded-full animate-bounce [animation-delay:0ms]"></div>
        <div className="w-3 h-3 bg-[#EAC81D] rounded-full animate-bounce [animation-delay:150ms]"></div>
        <div className="w-3 h-3 bg-[#BC6C5C] rounded-full animate-bounce [animation-delay:300ms]"></div>
        <div className="w-3 h-3 bg-[#5584DB] rounded-full animate-bounce [animation-delay:450ms]"></div>
      </div>

      {/* Shadow bawah */}
      <div className="absolute bottom-0 left-0 right-0 h-[150px] bg-gradient-to-t from-[#FFF7FC] to-transparent"></div>
    </div>
  );

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  const seasonColors = {
    Spring: { card: "from-[#FFEFF4] to-[#F1CED6]", button: "bg-[#CA217C]" },
    Summer: { card: "from-[#FFFEEF] to-[#F2ECD0]", button: "bg-[#EAC81D]" },
    Autumn: { card: "from-[#FFF0F0] to-[#F2D7D0]", button: "bg-[#BC6C5C]" },
    Winter: { card: "from-[#F7FBFF] to-[#DAD7E8]", button: "bg-[#5584DB]" },
  };

  let filteredFlowers = flowers.filter((flower) => {
    const matchesSeason = flower.season === selectedSeason;
    const matchesSearch = flower.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesAvailability =
      availabilityFilter === "available"
        ? flower.status
        : availabilityFilter === "unavailable"
        ? !flower.status
        : true;
    return matchesSeason && matchesSearch && matchesAvailability;
  });

  if (sortOption === "harga-asc") filteredFlowers.sort((a, b) => a.price - b.price);
  else if (sortOption === "harga-desc") filteredFlowers.sort((a, b) => b.price - a.price);
  else if (sortOption === "umur-asc") filteredFlowers.sort((a, b) => a.lifespan - b.lifespan);
  else if (sortOption === "umur-desc") filteredFlowers.sort((a, b) => b.lifespan - a.lifespan);

  return (
    <div className={`${dmSans.variable} font-dm flex flex-col min-h-screen bg-[#fff8f7]`}>
      <Header
        setMenuOpen={setMenuOpen}
        activeSection={activeSection}
        isLoggedIn={!!user}
        onCartClick={() => setCartOpen(true)}
      />

      <main className="h-full bg-[#FFF7FC] pb-20">
        {/* Hero */}
        <section className="relative text-center w-full overflow-hidden bg-[#F1D7D0]">
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px]">
            <Image
              src="/flower-header.png"
              alt="flower header"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-white/70"></div>

            <h1
              className={`font-caslon absolute inset-0 flex items-center justify-center
              text-6xl sm:text-8xl md:text-9xl text-[#451900] tracking-[0.15em] drop-shadow-md opacity-0 animate-[fadeIn_1s_ease-out_forwards]`}
            >
              Lunaria
            </h1>
          </div>
        </section>

        {/* Filter dan daftar bunga */}
        <section>
          {/* Tombol Musim */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-12 mb-12 px-4 max-w-xs sm:max-w-none mx-auto">
            {["Spring", "Summer", "Autumn", "Winter"].map((season) => {
              const isActive = selectedSeason === season;
              return (
                <button
                  key={season}
                  onClick={() => setSelectedSeason(season)}
                  className={`font-dm px-4 sm:px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
                    isActive
                      ? `${seasonColors[season].button} text-white`
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {season}
                </button>
              );
            })}
          </div>

          {/* Filter dan Search */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 px-6 sm:px-16 md:px-24 lg:px-32">
            <div className="w-full sm:w-44">
              <Select
                options={sortOptions}
                value={sortOptions.find(o => o.value === sortOption)}
                onChange={(selected) => setSortOption(selected.value)}
                placeholder="Sort"
                isSearchable={false}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderColor: state.isFocused ? "#CA217C" : "#e6d4ce",
                    boxShadow: state.isFocused ? "0 0 0 2px rgba(202,33,124,0.25)" : "none",
                    borderRadius: "0.75rem",
                    padding: "2px 4px",
                    cursor: "pointer",
                    "&:hover": { borderColor: "#c9a49d" },
                  }),
                  option: (base, { isFocused, isSelected }) => ({
                    ...base,
                    backgroundColor: isSelected
                      ? "#CA217C"
                      : isFocused
                      ? "#FBE6EE"
                      : "white",
                    color: isSelected ? "white" : "#555",
                    fontWeight: isSelected ? 600 : 500,
                    cursor: "pointer",
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: "white",
                    borderRadius: "0.75rem",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                    padding: "4px",
                    overflow: "hidden",
                    zIndex: 20,
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: "#451900",
                    fontWeight: 500,
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: "#987772",
                    fontWeight: 500,
                  }),
                  dropdownIndicator: (base, state) => ({
                    ...base,
                    color: state.isFocused ? "#CA217C" : "#987772",
                    transition: "transform 0.2s ease",
                    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }),
                }}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 12,
                  colors: {
                    ...theme.colors,
                    primary25: "#FBE6EE",
                    primary: "#CA217C",
                  },
                })}
              />
            </div>

            <div className="w-full sm:w-44">
              <Select
                options={availabilityOptions}
                value={availabilityOptions.find(o => o.value === availabilityFilter)}
                onChange={(selected) => setAvailabilityFilter(selected.value)}
                placeholder="Availability"
                isSearchable={false}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderColor: state.isFocused ? "#CA217C" : "#e6d4ce",
                    boxShadow: state.isFocused ? "0 0 0 2px rgba(202,33,124,0.25)" : "none",
                    borderRadius: "0.75rem",
                    padding: "2px 4px",
                    cursor: "pointer",
                    "&:hover": { borderColor: "#c9a49d" },
                  }),
                  option: (base, { isFocused, isSelected }) => ({
                    ...base,
                    backgroundColor: isSelected
                      ? "#CA217C"
                      : isFocused
                      ? "#FBE6EE"
                      : "white",
                    color: isSelected ? "white" : "#555",
                    fontWeight: isSelected ? 600 : 500,
                    cursor: "pointer",
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: "white",
                    borderRadius: "0.75rem",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                    padding: "4px",
                    overflow: "hidden",
                    zIndex: 20,
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: "#451900",
                    fontWeight: 500,
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: "#987772",
                    fontWeight: 500,
                  }),
                  dropdownIndicator: (base, state) => ({
                    ...base,
                    color: state.isFocused ? "#CA217C" : "#987772",
                    transition: "transform 0.2s ease",
                    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }),
                }}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 12,
                  colors: {
                    ...theme.colors,
                    primary25: "#FBE6EE",
                    primary: "#CA217C",
                  },
                })}
              />
            </div>

            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Find your flower..."
                className="font-dm w-full border border-[#e6d4ce] bg-white/80 rounded-lg px-4 py-2 shadow-sm 
                          text-gray-700 transition-all duration-300 ease-in-out
                          hover:shadow-md hover:border-[#c9a49d]
                          focus:outline-none focus:ring-2 focus:ring-[#CA217C]/40"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </div>
          </div>

          {/* Grid bunga */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 justify-items-center mb-14 px-4 sm:px-12 md:px-20">
            {filteredFlowers.map((flower) => {
              const isAvailable = flower.status;
              return (
                <div
                  key={flower.id}
                  className={`relative w-[80%] sm:w-52 md:w-56 h-56 [perspective:1000px] transition-all ${
                    !isAvailable ? "opacity-60 grayscale" : ""
                  }`}
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] hover:[transform:rotateY(180deg)] rounded-xl shadow-lg bg-gradient-to-b ${seasonColors[selectedSeason].card}`}
                  >
                    {/* Depan */}
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl [backface-visibility:hidden]">
                      <Image
                        src={flower.image}
                        alt={flower.name}
                        width={300}
                        height={300}
                        className="object-contain max-h-full w-auto"
                      />
                    </div>

                    {/* Belakang */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2 sm:px-4 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                      <h2 className="font-serif text-base sm:text-xl mb-2">
                        {flower.name}
                      </h2>
                      <p className="font-dm text-xs sm:text-sm text-gray-600 mb-3">
                        {flower.meaning}
                      </p>
                      <button
                        disabled={!isAvailable}
                        onClick={() => setSelectedFlower(flower)}
                        className={`font-dm px-3 sm:px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
                          isAvailable
                            ? `${seasonColors[selectedSeason].button} hover:opacity-90`
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {isAvailable ? "See Details" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Popup bunga */}
          {selectedFlower && (
            <FlowerPopup
              flower={selectedFlower}
              flowers={flowers}
              onSelectFlower={setSelectedFlower}
              onClose={() => setSelectedFlower(null)}
              onAddToCart={handleAddToCart}
            />
          )}

          {/* Drawer cart */}
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

          {isMenuOpen && (
            <MobileMenu
              isOpen={isMenuOpen}
              setMenuOpen={setMenuOpen}
              activeSection={activeSection}
            />
          )}

        </section>
      </main>
      {/* Footer */}
          <Footer />
    </div>
  );
}
