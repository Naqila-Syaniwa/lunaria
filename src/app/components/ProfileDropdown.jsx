import Link from 'next/link';
import { LogOut, User, LogIn, UserPlus } from 'lucide-react';

// Fungsi logout
const handleLogout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
  window.location.assign('/');
};

export function ProfileDropdown({ isLoggedIn, onClose }) {
  console.log("ProfileDropdown rendering. isLoggedIn prop received:", isLoggedIn);
  return (
    
    // Dropdown z-index dinaikkan ke z-50
    <div className="absolute top-full right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fadeIn">
      {isLoggedIn ? (
        <>
          <Link href="/profile" onClick={onClose} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-pink-600 transition-colors w-full">
            <User className="w-4 h-4" />
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </>
      ) : (
        <>
          <Link href="/login" onClick={onClose} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-pink-600 transition-colors w-full">
            <LogIn className="w-4 h-4" />
            Login
          </Link>
          <Link href="/register" onClick={onClose} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-pink-600 transition-colors w-full">
            <UserPlus className="w-4 h-4" />
            Register
          </Link>
        </>
      )}
    </div>
  );
}