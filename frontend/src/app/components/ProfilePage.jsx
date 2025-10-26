'use client'

import { useEffect, useState } from 'react';
import { User, Phone, MapPin, LogOut, ChevronDown, ChevronUp, Home, CheckCircle2, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm",
});

const dummyOrder = {
  id: 'ORD-DEMO-001',
  date: '2024-10-20',
  status: 'Delivered',
  total: 450000,
  items: [
    { name: 'Rose Bouquet (Contoh)', qty: 2, price: 225000 }
  ],
  shippingAddress: 'Jl. Juri Lomba Frontend No. 1, Jakarta'
};

// Komponen popup
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

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('userInfo');
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    address: ''
  });

  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({ show: false, type: "success", message: "" }); // popup state

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
    router.push('/');
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
          router.push('/login');
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/${storedUser.id}`);
        if (!res.ok) throw new Error('Gagal mengambil data profil');
        
        const data = await res.json();
        setFormData({
          username: data.username || '',
          phone: data.phone || '',
          address: data.address || ''
        });
      } catch (err) {
        console.error("❌ Error saat fetch profil:", err);
      }
    };

    fetchProfile();
  }, [router]);

  // Fetch orders data
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
          setOrders([dummyOrder]);
          setLoading(false);
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${storedUser.id}`);
        const realOrders = await res.json();
        setOrders([dummyOrder, ...realOrders]);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error saat fetch orders:", err);
        setOrders([dummyOrder]);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser) {
        setPopup({ show: true, type: "error", message: "Kamu belum login!" });
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/${storedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Gagal update: ${response.status}`);

      const data = await response.json();
      console.log("✅ Response dari backend:", data);

      setPopup({ show: true, type: "success", message: "Profil berhasil diperbarui!" });
    } catch (err) {
      console.error("❌ Error saat update profil:", err);
      setPopup({ show: true, type: "error", message: "Gagal memperbarui profil!" });
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Shipped': return 'bg-blue-100 text-blue-700';
      case 'Processing': return 'bg-yellow-100 text-yellow-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className={`${dmSans.className} min-h-screen bg-gradient-to-br from-[#FFDAF5] via-[#E9B6C2] to-[#E1688B] p-6`}>
      {/* Home Icon */}
      {typeof window !== "undefined" && localStorage.getItem("user") && (
        <div className="fixed top-6 left-6 z-50">
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-white/70 backdrop-blur-md text-gray-800 hover:bg-white hover:scale-110 transition-all duration-300"
            aria-label="Kembali ke Home"
          >
            <Home className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Header */}
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
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          {/* Tabs */}
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

          {/* Content */}
          <div className="p-8">
            {activeTab === 'userInfo' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Dashboard</h2>
                
                <div className="space-y-6">
                  {/* Form fields */}
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
                    onClick={handleSubmit}
                    className="w-full py-4 bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-[1.02] transition-all"
                  >
                    💾 Simpan Perubahan
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h2>
                
                {loading ? (
                  <div className="text-center py-16">
                    <div className="text-4xl mb-4">⏳</div>
                    <p className="text-gray-500">Loading orders...</p>
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
                            <span>{order.date}</span>
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
                                    <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                                  </div>
                                  <p className="font-bold text-gray-800">
                                    Rp {item.price.toLocaleString('id-ID')}
                                  </p>
                                </div>
                              ))}
                            </div>

                            <div className="bg-white p-4 rounded-xl shadow-sm">
                              <div className="flex items-start gap-3">
                                <span className="text-pink-500 text-xl">📍</span>
                                <div>
                                  <p className="font-semibold text-gray-700 mb-1">Shipping Address</p>
                                  <p className="text-gray-600">{order.shippingAddress}</p>
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

      {/* Popup muncul di atas semua */}
      {popup.show && (
        <MessagePopup
          type={popup.type}
          message={popup.message}
          onClose={() => setPopup({ show: false, type: "success", message: "" })}
        />
      )}
    </div>
  );
}
