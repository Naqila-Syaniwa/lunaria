'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Icon untuk pesan notifikasi (inline SVG)
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

// Komponen Notifikasi Pengganti Alert
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


export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  // State untuk notifikasi pengganti alert
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' }); // Reset pesan

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // Gunakan notifikasi state
        setMessage({ text: data.message || 'Login gagal', type: 'error' });
      } else {
        // Gunakan notifikasi state
        setMessage({ text: `Welcome back, ${data.user.username}!`, type: 'success' });
        
        // Simpan user data ke localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Redirect ke profile atau home setelah 2 detik
        setTimeout(() => {
          router.push('/'); // pindah tanpa reload penuh
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      // Gunakan notifikasi state
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
    <div className="min-h-screen bg-gradient-to-br from-[#F1D7D0] via-[#FFDAF5] to-[#E9B6C2] flex items-center justify-center p-4 sm:p-10 font-inter">
      {/* Komponen Notifikasi akan render di sini */}
      <Notification 
        message={message.text} 
        type={message.type} 
        onClose={() => setMessage({ text: '', type: '' })} 
      />

      {/* Main Card */}
      <div className="flex flex-col lg:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-6xl animate-fadeIn">
        
        {/* Illustration Section (Kiri) - Diperbarui */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#FCE3CF] via-[#FFD5E5] to-[#E9AFA3] p-16 flex flex-col justify-center items-center relative overflow-hidden rounded-l-3xl">
          {/* Decorative Elements - diubah warnanya */}
          <div className="absolute top-[10%] left-[10%] w-36 h-36 rounded-full bg-white/20 animate-spinSlow" /> {/* Animasi baru */}
          <div className="absolute bottom-[15%] right-[15%] w-24 h-24 rounded-full bg-white/20 animate-pulseSlow" /> {/* Animasi baru */}
          <div className="absolute top-[60%] left-[5%] w-20 h-20 rounded-full bg-white/20 animate-spinSlow delay-1000" />

          {/* Animasi Gradien Berputar */}
          <div className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] animate-rotateLight pointer-events-none">
            <div className="w-full h-full bg-gradient-radial from-white/10 to-transparent" />
          </div>

          {/* Gambar Utama (Bunga/Elemen Abstrak) */}
          <div className="flex-1 w-full flex items-center justify-center z-10 animate-floatFast"> {/* Animasi baru */}
            <img 
              src="/loginflower.png"
              alt="Abstract Floral Elements"
              onError={(e) => e.target.src = 'https://placehold.co/600x600/FCE3CF/E9AFA3?text=Lunaria+Dawn'}
              className="h-full w-auto object-contain max-h-[80%]"
              style={{
                filter: 'drop-shadow(0 15px 30px rgba(255, 165, 0, 0.2))', // Bayangan warna oranye/peach
                transform: 'scale(0.95)' // Sedikit lebih kecil agar fokus
              }}
            />
          </div>

          {/* Teks Sambutan */}
          <div className="text-center mt-10 z-10">
            <p className="text-lg text-[#8B4513] font-dm font-medium">Step into the light of Lunaria</p>
          </div>
        </div>

        {/* Form Section (Kanan) - Diperbarui */}
        <div className="w-full lg:w-1/2 px-8 sm:px-16 md:px-20 py-14 flex flex-col justify-center bg-white">
          <h1 className="text-center text-4xl font-dm font-bold text-gray-800 mb-2">Log In</h1>
          <p className="text-center text-gray-500 mb-8 text-sm font-dm ">Welcome back! Enter your details to continue.</p>

          <form onSubmit={handleSubmit}>
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
                placeholder="you@example.com"
                required
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-orange-300 focus:bg-white focus:shadow-lg focus:shadow-orange-100"
              />
            </div>

            {/* Password */}
            <div className="mb-5 relative">
              <label htmlFor="password" className="block mb-2 text-gray-600  font-dm font-medium text-sm">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-orange-300 focus:bg-white focus:shadow-lg focus:shadow-orange-100"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-[42px] cursor-pointer text-gray-400 hover:text-orange-500 text-xl select-none"
              >
                {showPassword ? '🙈' : '👁️️'}
              </span>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right mb-4">
              <a href="#" className="text-sm text-[#E77D3C] hover:underline  font-dm font-medium">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 mt-4 bg-gradient-to-r from-[#CA217C] to-[#E1688B] text-white rounded-xl  font-dm font-semibold text-lg transition-all duration-300 shadow-lg shadow-pink-300/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-300/50 active:translate-y-0 disabled:opacity-70 disabled:hover:-translate-y-0`}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-4 text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Register Link */}
          <p className="text-center mt-2 text-gray-600 text-sm  font-dm ">
            Don't have an account?{' '}
            <a href="/register" className="text-[#E77D3C]  font-dm font-semibold hover:text-orange-700 hover:underline transition-colors">
              Sign Up Now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

