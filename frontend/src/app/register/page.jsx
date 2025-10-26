'use client';

import { useState } from 'react';
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Gagal mendaftar');
    } else {
      alert(` ${data.message}\n\nUsername: ${data.user.username}\nEmail: ${data.user.email}`);
      setFormData({ username: '', email: '', password: '' });
    }
  } catch (err) {
    console.error(err);
    alert('Terjadi kesalahan pada server.');
  }
};


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFDAF5] via-[#E9B6C2] to-[#E1688B] flex  items-center justify-center p-10">
      <div className="flex bg-white rounded-3xl shadow-2xl overflow-hidden w-[95%] max-w-[1400px] animate-fadeIn">
        
        {/* Illustration Section */}
        <div className="flex-1 bg-gradient-to-br from-[#DAD8E8] via-[#FFF7FC] to-[#C9B2DB] p-16 flex flex-col justify-center items-center relative overflow-hidden">
          {/* Decorative Circles */}
        <div className="absolute top-[10%] left-[10%] w-36 h-36 rounded-full bg-white/10 animate-float1" />
        <div className="absolute bottom-[15%] right-[15%] w-24 h-24 rounded-full bg-white/10 animate-float2" />
         <div className="absolute top-[60%] left-[5%] w-20 h-20 rounded-full bg-white/10  animate-float3" />
          
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

        {/* Form Section */}
        <div className="flex-1 px-20 py-14 flex flex-col justify-center bg-white">
          <h1 className="text-center text-4xl  font-dm font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-center text-gray-500 mb-8 text-sm  font-dm">Fill in your information to create an account</p>

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="mb-5">
              <label htmlFor="username" className="block mb-2 text-gray-600  font-dm font-medium text-sm">
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
              <label htmlFor="email" className="block mb-2 text-gray-600  font-dm font-medium text-sm">
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
              <label htmlFor="password" className="block mb-2 text-gray-600  font-dm font-medium text-sm">
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 mt-4 bg-gradient-to-r from-[#c6c1e9]  to-[#C9B2DB] text-white rounded-xl  font-dm font-semibold text-lg transition-all duration-300 shadow-lg shadow-purple-300/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-300/50 hover:from-purple-400 hover:to-purple-500 active:translate-y-0"
            >
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6 text-gray-400 text-sm">
            <div className="flex-1 h-px bg-gray-300" />
            <div className="flex-1 h-px bg-gray-300" />
          </div>


          {/* Login Link */}
          <p className="text-center mt-6 text-gray-600 text-sm  font-dm ">
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