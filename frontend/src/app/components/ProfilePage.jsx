'use client'

import { useEffect, useState } from 'react';
import { 
  User, Phone, MapPin, LogOut, ChevronDown, ChevronUp, 
  Home, CheckCircle2, XCircle, Save, Trash2, AlertTriangle 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm",
});

// === Komponen popup sukses/error ===
function MessagePopup({ type = "success", message, onClose }) {
  const isSuccess = type === "success";
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[85%] sm:w-[360px] text-center">
        <div className="flex justify-center mb-3">
          {isSuccess ? (
            <CheckCircle2 className="text-green-500 w-12 h-12" />
          ) : (
            <XCircle className="text-red-500 w-12 h-12" />
          )}
        </div>
        <p className="text-gray-700 font-medium mb-5 whitespace-pre-line">{message}</p>
        <button
          onClick={onClose}
          className={`px-5 py-2 rounded-lg text-white font-semibold transition ${
            isSuccess
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          OK
        </button>
      </div>
    </div>
  );
}

// === Modal konfirmasi delete akun ===
function DeleteConfirmationModal({ isOpen, onClose, onConfirm, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[110] animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-[90%] sm:w-[400px]">
        <div className="flex flex-col items-center text-center">
          <AlertTriangle className="text-red-500 w-14 h-14 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Delete Account?</h2>
          <p className="text-gray-600 mb-6">
            Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone.
          </p>
          <div className="flex justify-center gap-4 w-full">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-5 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                'Yes, Delete It'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// === Halaman Profil ===
export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('userInfo');
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    address: ''
  });
  const [userId, setUserId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [popup, setPopup] = useState({ show: false, type: "success", message: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogout = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      localStorage.removeItem(`cart_${user.email}`);
      localStorage.removeItem("user");
    }
    router.push('/login');
  };

  // Fetch profil & pesanan
  useEffect(() => {
    let fetchedUserId = null;
    setLoadingProfile(true);
    setLoadingOrders(true);

    try {
      const userString = localStorage.getItem('user');
      if (!userString) throw new Error("Not logged in");
      const userData = JSON.parse(userString);
      if (!userData || !userData.id) throw new Error("Invalid user data");
      fetchedUserId = userData.id;
      setUserId(fetchedUserId);
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem('user');
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/${fetchedUserId}`);
        if (!res.ok) throw new Error('Gagal mengambil data profil');
        const data = await res.json();
        setFormData({
          username: data.username || '',
          phone: data.phone || '',
          address: data.address || ''
        });
      } catch (err) {
        console.error("❌ Error saat fetch profil:", err);
        setPopup({ show: true, type: "error", message: `Gagal memuat profil: ${err.message}` });
      } finally {
        setLoadingProfile(false);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${fetchedUserId}`);
        if (!res.ok) throw new Error('Gagal mengambil data pesanan');
        const realOrders = await res.json();
        setOrders(realOrders || []);
      } catch (err) {
        console.error("❌ Error saat fetch orders:", err);
        setOrders([]);
        setPopup({ show: true, type: "error", message: `Gagal memuat pesanan: ${err.message}` });
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchProfile();
    fetchOrders();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setPopup({ show: true, type: "error", message: "User ID tidak ditemukan. Silakan login ulang." });
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error(`Gagal update: ${response.status}`);
      const data = await response.json();
      setPopup({ show: true, type: "success", message: "Profil berhasil diperbarui!" });
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser && storedUser.username !== data.user.username) {
        localStorage.setItem('user', JSON.stringify({ ...storedUser, username: data.user.username }));
      }
    } catch (err) {
      console.error("❌ Error saat update profil:", err);
      setPopup({ show: true, type: "error", message: `Gagal memperbarui profil: ${err.message}` });
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId) {
      setPopup({ show: true, type: "error", message: "User ID tidak ditemukan. Silakan login ulang." });
      return;
    }
    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/${userId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Gagal menghapus akun');
      setPopup({ show: true, type: "success", message: 'Akun berhasil dihapus. Anda akan logout.' });
      setTimeout(() => handleLogout(), 2000);
    } catch (err) {
      console.error("❌ Error deleting account:", err);
      setPopup({ show: true, type: "error", message: `Gagal menghapus akun: ${err.message}` });
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Shipped': return 'bg-blue-100 text-blue-700';
      case 'Processing': return 'bg-yellow-100 text-yellow-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#FFDAF5] via-[#E9B6C2] to-[#E1688B] text-white">
        {/* Animasi bunga berputar */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 animate-pulse shadow-lg flex items-center justify-center">
            <span className="text-4xl animate-spin-slow">🌸</span>
          </div>
          <div className="absolute w-28 h-28 border-4 border-white/20 rounded-full animate-ping-slow"></div>
        </div>

        {/* Teks shimmer */}
        <p className="text-xl font-semibold bg-gradient-to-r from-white/80 to-white/30 bg-clip-text text-transparent animate-pulse">
          Memuat Profil Anda...
        </p>

        {/* Subteks */}
        <p className="text-sm mt-3 text-white/80 tracking-wide animate-fadeIn">
          Mohon tunggu sebentar 🌷
        </p>

        {/* CSS tambahan untuk animasi kustom */}
        <style jsx>{`
          .animate-spin-slow {
            animation: spin 5s linear infinite;
          }
          .animate-ping-slow {
            animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          .animate-fadeIn {
            animation: fadeIn 2s ease-in-out infinite alternate;
          }
          @keyframes fadeIn {
            from { opacity: 0.5; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`${dmSans.className} min-h-screen bg-gradient-to-br from-[#FFDAF5] via-[#E9B6C2] to-[#E1688B] p-6`}>
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => router.push('/')}
          className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-white/70 backdrop-blur-md text-gray-800 hover:bg-white hover:scale-110 transition-all duration-300"
          aria-label="Kembali ke Home"
        >
          <Home className="w-6 h-6" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto mb-8 pt-4">
        <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
              🌸
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Profil Saya</h1>
              <p className="text-gray-600">Kelola informasi dan riwayat pesanan Anda</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-pink-300 transition-all duration-300 flex items-center gap-2 shadow-md"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex border-b-2 border-gray-100">
            <button
              onClick={() => setActiveTab('userInfo')}
              className={`flex-1 py-5 text-lg font-semibold transition-all duration-300 ${
                activeTab === 'userInfo'
                  ? 'text-pink-600 border-b-4 border-pink-500 bg-pink-50'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              User Info
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-5 text-lg font-semibold transition-all duration-300 ${
                activeTab === 'orders'
                  ? 'text-pink-600 border-b-4 border-pink-500 bg-pink-50'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              Riwayat Pesanan
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'userInfo' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Dashboard</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                      <User className="w-5 h-5 text-pink-500" />
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                      placeholder="Masukkan username"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                      <Phone className="w-5 h-5 text-pink-500" />
                      No. Telepon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                      <MapPin className="w-5 h-5 text-pink-500" />
                      Alamat
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100 resize-none"
                      placeholder="Masukkan alamat lengkap Anda"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-[1.02] transition-all"
                  >
                    <Save className="inline-block w-5 h-5 mr-2" />
                    Simpan Perubahan
                  </button>
                </form>

                {/* === DANGER ZONE === */}
                <div className="mt-12 border-t pt-8 border-red-200">
                  <h3 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h3>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full py-3 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl font-semibold transition-all duration-300 hover:bg-red-100 hover:border-red-400 flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete My Account
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Tindakan ini permanen dan tidak dapat dibatalkan.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h2>
                {loadingOrders ? (
                  <div className="text-center py-16">
                    <svg className="animate-spin h-8 w-8 text-pink-500 mx-auto mb-4"></svg>
                    Loading orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-xl text-gray-500">Belum ada pesanan</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border-2 border-gray-200 rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300"
                      >
                        <div
                          className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-4">
                              <h3 className="text-xl font-bold text-gray-800">{order.id}</h3>
                              <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                            {expandedOrder === order.id ? (
                              <ChevronUp className="w-6 h-6 text-gray-400 hover:text-pink-500" />
                            ) : (
                              <ChevronDown className="w-6 h-6 text-gray-400 hover:text-pink-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                            <span>📅</span>
                            <span>{new Date(order.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric'})}</span>
                          </div>
                          <div className="text-2xl font-bold text-gray-800">
                            Rp {order.total.toLocaleString('id-ID')}
                          </div>
                        </div>

                        {expandedOrder === order.id && (
                          <div className="border-t-2 border-gray-100 p-6 bg-gray-50">
                            <h4 className="font-bold text-gray-800 mb-4 text-lg">Order Items</h4>
                            <div className="space-y-3 mb-6">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                                  <div>
                                    <p className="font-semibold text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity || item.qty}</p>
                                  </div>
                                  <p className="font-bold text-gray-800">
                                    Rp {(item.price * (item.quantity || item.qty)).toLocaleString('id-ID')}
                                  </p>
                                </div>
                              ))}
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm">
                              <div className="flex items-start gap-3">
                                <span className="text-pink-500 text-xl">📍</span>
                                <div>
                                  <p className="font-semibold text-gray-700 mb-1">Shipping Address</p>
                                  <p className="text-gray-600">{order.shipping_address || order.shippingAddress}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* POPUP */}
      {popup.show && (
        <MessagePopup
          type={popup.type}
          message={popup.message}
          onClose={() => setPopup({ show: false, type: "success", message: "" })}
        />
      )}

      {/* MODAL KONFIRMASI DELETE */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
        isLoading={isDeleting}
      />
    </div>
  );
}