"use client";
import { useState } from "react";
import { X, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { DM_Sans } from "next/font/google";
import LoginRequiredModal from "./LoginRequiredModal";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm",
});

function MessagePopup({ type = "success", message, onClose }) {
  const isSuccess = type === "success";
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[85%] sm:w-[360px] text-center animate-fadeIn">
        <div className="flex justify-center mb-3">
          {isSuccess ? (
            <CheckCircle2 className="text-green-500 w-12 h-12" />
          ) : (
            <XCircle className="text-red-500 w-12 h-12" />
          )}
        </div>
        <p className="text-gray-700 font-medium mb-5">{message}</p>
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

export default function PaymentPopup({ total, cartItems = [], onClose, onConfirm }) {
  const [method, setMethod] = useState("credit");
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: "success", message: "" });

  const handlePay = async () => {
    setLoading(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) {
        setShowLoginModal(true);
        setLoading(false);
        return;
      }

      // 🔹 Ambil alamat terbaru dari database
      const profileRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/profile/${storedUser.id}`
      );
      if (!profileRes.ok) throw new Error("Gagal mengambil profil user");
      const profileData = await profileRes.json();
      const finalAddress = profileData.address || "Alamat belum diisi";

      // Simulasi delay pembayaran
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const orderData = {
        userId: storedUser.id,
        items: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
          to: item.to || "",
          message: item.message || "",
          isPublic: item.isPublic || false,
        })),
        total,
        shippingAddress: finalAddress,
        paymentMethod: method,
      };

      console.log("📦 orderData:", orderData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) throw new Error("Gagal membuat order");

      const result = await response.json();

      // Popup sukses
      setPopup({
        show: true,
        type: "success",
        message: `Pembayaran berhasil!\nOrder ID: ${result.order.id}`,
      });

      // Kosongkan keranjang
      const cartKey = `cart_${storedUser.email}`;
      localStorage.removeItem(cartKey);

      setLoading(false);
    } catch (error) {
      console.error("❌ Payment error:", error);
      setPopup({
        show: true,
        type: "error",
        message: "Payment failed. Please try again.",
      });
      setLoading(false);
    }
  };

  const handlePopupClose = () => {
    setPopup({ show: false, type: "success", message: "" });
    if (popup.type === "success") onConfirm();
  };

  return (
    <div
      className={`${dmSans.className} fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm`}
    >
      <div className="bg-white w-[90%] sm:w-[420px] rounded-2xl shadow-lg overflow-hidden animate-fade-in relative">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Payment Method</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={22} />
          </button>
        </div>

        {/* Pilihan metode pembayaran */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            className={`px-4 py-2 rounded-lg border font-medium ${
              method === "credit"
                ? "bg-[#987772] text-white border-[#987772]"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setMethod("credit")}
          >
            Credit Card
          </button>
          <button
            className={`px-4 py-2 rounded-lg border font-medium ${
              method === "paypal"
                ? "bg-[#987772] text-white border-[#987772]"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setMethod("paypal")}
          >
            PayPal
          </button>
        </div>

        {/* Form input kartu */}
        <div className="p-5">
          {method === "credit" ? (
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#987772]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#987772]"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Expiry
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#987772]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    maxLength={3}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#987772]"
                  />
                </div>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center py-6">
              <div className="text-6xl mb-4">💳</div>
              <p className="text-gray-600 text-center text-sm mb-4">
                You will be redirected to PayPal to complete your purchase securely.
              </p>
              {loading && (
                <div className="flex items-center gap-2 text-[#987772]">
                  <Loader2 className="animate-spin" size={18} />
                  <span>Processing payment...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="flex justify-between mb-3">
            <p className="font-medium">Total:</p>
            <p className="font-semibold text-lg">
              Rp {total.toLocaleString("id-ID")}
            </p>
          </div>

          <button
            onClick={handlePay}
            disabled={loading}
            className={`w-full bg-gradient-to-r from-[#987772] to-[#451900] text-white py-2 rounded-lg shadow transition ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {loading
              ? "Processing..."
              : method === "credit"
              ? "Pay with Credit Card"
              : "Pay with PayPal"}
          </button>
        </div>

        {/* Modal login & popup hasil */}
        <LoginRequiredModal
          show={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
        {popup.show && (
          <MessagePopup
            type={popup.type}
            message={popup.message}
            onClose={handlePopupClose}
          />
        )}
      </div>
    </div>
  );
}
