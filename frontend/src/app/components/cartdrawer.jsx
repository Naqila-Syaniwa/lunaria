"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Trash2, Globe, Lock } from "lucide-react";
import PaymentPopup from "./paymentpopup";
import { DM_Sans } from "next/font/google";
import { useRouter } from 'next/navigation';

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm",
});

export default function CartDrawer({ cartItems, onClose, onUpdateQty, onRemove }) {
  const [showPayment, setShowPayment] = useState(false);
  const router = useRouter();
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = 5000;
  const total = subtotal + shipping;

  // Disable scroll saat cart terbuka
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  return (
    <div
      className={`${dmSans.className} fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm`}
    >
      <div className="bg-white w-full sm:w-[420px] h-full flex flex-col shadow-xl animate-slide-in">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={22} />
          </button>
        </div>

        {/* Isi cart */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">Your cart is empty</p>
          ) : (
            cartItems.map((item, i) => (
              <div key={i} className="flex flex-col gap-3 border-b py-3">
                {/* Bagian utama produk */}
                <div className="flex gap-3 items-center">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={70}
                    height={70}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-serif text-base font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.meaning.split(";")[0]}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <button
                        className="border w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100"
                        onClick={() =>
                          onUpdateQty(item.id, Math.max(item.qty - 1, 1))
                        }
                      >
                        -
                      </button>
                      <span>{item.qty}</span>
                      <button
                        className="border w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100"
                        onClick={() => onUpdateQty(item.id, item.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-medium">
                      Rp {(item.price * item.qty).toLocaleString("id-ID")}
                    </p>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-gray-400 hover:text-red-600 mt-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Input nama, pesan, dan toggle public/private */}
                <div className="pl-[82px] pr-2 space-y-2">
                  <input
                    type="text"
                    placeholder="Recipient's Name"
                    value={item.to || ""}
                    onChange={(e) =>
                      onUpdateQty(item.id, item.qty, { to: e.target.value })
                    }
                    className="w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-gray-300"
                  />
                  <textarea
                    placeholder="Write a message for the recipient..."
                    value={item.message || ""}
                    onChange={(e) =>
                      onUpdateQty(item.id, item.qty, { message: e.target.value })
                    }
                    className="w-full border rounded-md p-2 text-sm h-16 resize-none focus:ring-1 focus:ring-gray-300"
                  />

                  {/* Tombol Public / Private */}
                  <button
                    onClick={() =>
                      onUpdateQty(item.id, item.qty, {
                        isPublic: !item.isPublic,
                      })
                    }
                    className={`flex items-center gap-2 text-sm font-medium mt-1 transition-all ${
                      item.isPublic
                        ? "text-green-700 hover:text-green-800"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {item.isPublic ? (
                      <>
                        <Globe size={16} /> Message is Public
                      </>
                    ) : (
                      <>
                        <Lock size={16} /> Message is Private
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <p>Subtotal</p>
            <p>Rp {subtotal.toLocaleString("id-ID")}</p>
          </div>
          <div className="flex justify-between text-sm">
            <p>Shipping</p>
            <p>
              {shipping === 0
                ? "Free"
                : `Rp ${shipping.toLocaleString("id-ID")}`}
            </p>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <p>Total</p>
            <p>Rp {total.toLocaleString("id-ID")}</p>
          </div>

          <button
            onClick={() => setShowPayment(true)}
            className="group w-full mt-3 relative overflow-hidden rounded-lg 
                        bg-gradient-to-r from-[#987772] to-[#451900]
                        text-white py-3 font-semibold tracking-wide shadow-md transition-all duration-300 
                        hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Checkout
            </span>

            {/* Efek cahaya lembut saat hover */}
            <span
              className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/20 to-white/5 
                            translate-x-[-100%] group-hover:translate-x-[100%] 
                            transition-transform duration-700 ease-in-out rounded-lg"
            />
          </button>
        </div>
      </div>
      
      {/* Popup Payment */}
      {showPayment && (
        <PaymentPopup
          total={total}
          cartItems={cartItems}
          onClose={() => setShowPayment(false)}
          onConfirm={() => {
            setShowPayment(false);
            onClose();
           router.push('/profile');
          }}
        />
      )}
    </div>
  );
}
