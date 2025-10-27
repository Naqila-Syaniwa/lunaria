'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // <-- Tambahkan import ini
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

// --- Mulai: Komponen Notifikasi (di-copy dari LoginPage Anda) ---
const CheckCircleIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const ExclamationCircleIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

function Notification({ message, type, onClose }) {
  if (!message) return null;

  const isError = type === 'error';
  const bgColor = isError ? 'bg-red-100' : 'bg-green-100';
  const borderColor = isError ? 'border-red-400' : 'border-green-400';
  const textColor = isError ? 'text-red-700' : 'text-green-700';
  const Icon = isError ? ExclamationCircleIcon : CheckCircleIcon;

  return (
    <div
      className={`fixed top-5 right-5 z-50 max-w-sm rounded-xl border ${borderColor} ${bgColor} p-4 shadow-lg animate-fadeIn`}
      role="alert"
    >
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${textColor}`}>
          <Icon />
        </div>
        <div className={`ml-3 ${textColor}`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          type="button"
          className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 ${textColor} inline-flex h-8 w-8 hover:bg-opacity-50 ${isError ? 'hover:bg-red-200' : 'hover:bg-green-200'}`}
          onClick={onClose}
        >
          <span className="sr-only">Dismiss</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
// --- Selesai: Komponen Notifikasi ---


export default function RegisterPage() {
  const router = useRouter(); // <-- Tambahkan router
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  // State untuk notifikasi (menggantikan alert)
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' }); // Reset pesan

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // Ganti alert dengan notifikasi
        setMessage({ text: data.message || 'Gagal mendaftar', type: 'error' });
      } else {
        // Ganti alert dengan notifikasi
        setMessage({ text: data.message || 'Pendaftaran berhasil! Mengalihkan ke login...', type: 'success' });
        setFormData({ username: '', email: '', password: '' });
        
        // Redirect ke login setelah 2 detik
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      // Ganti alert dengan notifikasi
      setMessage({ text: 'Terjadi kesalahan pada server.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    // PERBAIKAN: Ganti padding 'p-10' menjadi responsif
    <div className="min-h-screen bg-gradient-to-br from-[#FFDAF5] via-[#E9B6C2] to-[#E1688B] flex items-center justify-center p-4 sm:p-10">
      
      {/* Tambahkan komponen Notifikasi di sini */}
      <Notification 
        message={message.text} 
        type={message.type} 
        onClose={() => setMessage({ text: '', type: '' })} 
      />

      {/* PERBAIKAN UTAMA:
        1. Ganti 'flex' menjadi 'flex-col lg:flex-row' (tumpuk di mobile, menyamping di desktop)
        2. Ganti 'w-[95%] max-w-[1400px]' menjadi 'w-full max-w-6xl' (konsisten dengan login)
      */}
      <div className="flex flex-col lg:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-6xl animate-fadeIn">
        
        {/* PERBAIKAN: 
          1. Ganti 'flex-1' menjadi 'w-full lg:w-1/2'
          2. Ganti 'p-16' menjadi padding responsif 'p-8 sm:p-12 lg:p-16'
        */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#DAD8E8] via-[#FFF7FC] to-[#C9B2DB] p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-center relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-[10%] left-[10%] w-36 h-36 rounded-full bg-white/10 animate-float1" />
          <div className="absolute bottom-[15%] right-[15%] w-24 h-24 rounded-full bg-white/10 animate-float2" />
          <div className="absolute top-[60%] left-[5%] w-20 h-20 rounded-full bg-white/10 animate-float3" />
          
          {/* Rotating Gradient Background */}
          <div className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] animate-rotate pointer-events-none">
            <div className="w-full h-full bg-gradient-radial from-white/10 to-transparent" />
          </div>

          {/* Big Flower */}
          <div className="flex-1 w-full flex items-center justify-center" style={{animation: 'slowFloat 8s ease-in-out infinite'}}>
            <img 
              src="/register.png" 
              alt="Lily Flowers"
              className="h-full w-auto object-cover"
              style={{
                maxHeight: '100%',
                filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.15))'
              }}
            />
          </div>

          {/* Welcome Text */}
          <div className="text-center mt-10 z-10">
            <p className="text-lg text-[#664b7b]">Sign up to start your journey</p>
          </div>
        </div>

        {/* PERBAIKAN: 
          1. Ganti 'flex-1' menjadi 'w-full lg:w-1/2'
          2. Ganti 'px-20 py-14' menjadi padding responsif 'px-8 sm:px-16 py-14'
        */}
        <div className="w-full lg:w-1/2 px-8 sm:px-16 py-14 flex flex-col justify-center bg-white">
          <h1 className="text-center text-4xl font-dm font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-center text-gray-500 mb-8 text-sm font-dm">Fill in your information to create an account</p>

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="mb-5">
              <label htmlFor="username" className="block mb-2 text-gray-600 font-dm font-medium text-sm">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Masukkan username"
                required
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-green-300 focus:bg-white focus:shadow-lg focus:shadow-green-100"
              />
            </div>

            {/* Email */}
            <div className="mb-5">
              <label htmlFor="email" className="block mb-2 text-gray-600 font-dm font-medium text-sm">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan email"
                required
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-green-300 focus:bg-white focus:shadow-lg focus:shadow-green-100"
              />
            </div>

            {/* Password */}
            <div className="mb-5 relative">
              <label htmlFor="password" className="block mb-2 text-gray-600 font-dm font-medium text-sm">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                required
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-green-300 focus:bg-white focus:shadow-lg focus:shadow-green-100"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-[42px] cursor-pointer text-gray-400 hover:text-green-400 text-xl select-none"
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>

            {/* Submit Button (Tambahkan disable saat loading) */}
            <button
              type="submit"
              disabled={isLoading} // <-- Tambahkan ini
              className="w-full py-4 mt-4 bg-gradient-to-r from-[#c6c1e9] to-[#C9B2DB] text-white rounded-xl font-dm font-semibold text-lg transition-all duration-300 shadow-lg shadow-purple-300/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-300/50 hover:from-purple-400 hover:to-purple-500 active:translate-y-0 disabled:opacity-70 disabled:hover:-translate-y-0"
            >
              {/* Tambahkan teks loading */}
              {isLoading ? 'Mendaftarkan...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6 text-gray-400 text-sm">
            <div className="flex-1 h-px bg-gray-300" />
            <div className="flex-1 h-px bg-gray-300" />
          </div>


          {/* Login Link */}
          <p className="text-center mt-6 text-gray-600 text-sm font-dm ">
            Have an account?{' '}
            <a href="/login" className="text-[#664b7b] font-dm font-semibold hover:text-green-500 hover:underline transition-colors">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}