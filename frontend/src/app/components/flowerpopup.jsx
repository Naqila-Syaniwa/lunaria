"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import PaymentPopup from "./paymentpopup";
import { DM_Sans } from "next/font/google";
import LoginRequiredModal from "./LoginRequiredModal";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm",
});

export default function FlowerPopup({
  flower,
  flowers,
  onSelectFlower,
  onClose,
  onAddToCart,
}) {
  const [showImage, setShowImage] = useState(null);
  const [amount, setAmount] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (!flower) return null;

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedUser = localStorage.getItem("user");
    setIsLoggedIn(loggedIn);
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleChangeAmount = (type) => {
    setAmount((prev) => {
      if (type === "decrease") return Math.max(prev - 1, 1);
      if (type === "increase") return prev + 1;
      return prev;
    });
  };

  const handleAddClick = () => {
    onAddToCart({ ...flower, qty: amount });
    onClose();
  };

  return (
    <div
      className={`${dmSans.className} fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-3 sm:px-0`}
    >
      <div className="bg-[#fff8f7] rounded-2xl p-5 sm:p-6 w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
        {/* Tombol close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-red-600 text-white rounded-full w-8 h-8 text-lg flex items-center justify-center hover:bg-red-400"
        >
          ×
        </button>

        {/* Konten scrollable */}
        <div className="flex-1 overflow-y-auto pr-1 sm:pr-3">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 mt-8 sm:ml-5">
            {/* Bagian gambar */}
            <div className="flex flex-col gap-4 items-center md:mr-7 flex-shrink-0">
              <Image
                src={flower.image}
                alt={flower.name}
                width={370}
                height={340}
                style={{
                  width: "100%",
                  maxWidth: "370px",
                  height: "auto",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                className="rounded-xl shadow hover:scale-105 transition-transform"
                onClick={() => setShowImage(flower.image)}
              />

              {/* Gambar tambahan */}
              {flower.otherImages?.length > 0 && (
                <div className="flex gap-3 flex-wrap justify-center">
                  {flower.otherImages.map((img, i) => (
                    <Image
                      key={i}
                      src={img}
                      alt={`${flower.name} var ${i + 1}`}
                      width={100}
                      height={100}
                      className="rounded-lg shadow cursor-pointer hover:scale-105 transition-transform w-[80px] sm:w-[120px]"
                      onClick={() => setShowImage(img)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Detail produk */}
            <div className="flex-1 text-[#451900] flex flex-col pb-24 md:pb-0">
              <h2 className="text-2xl sm:text-3xl font-serif mb-2 text-center md:text-left">
                {flower.name}
              </h2>

              <p className="text-lg font-semibold text-center md:text-left">
                Rp {flower.price.toLocaleString("id-ID")}
              </p>
              <p className="mt-2 text-center md:text-left">
                Lifespan: {flower.lifespan} Days
              </p>
              <p className="mt-3 text-sm text-gray-700 text-center md:text-left">
                {flower.meaning}
              </p>

              {/* Amount */}
              <div className="mt-5 flex items-center justify-center md:justify-start gap-4">
                <p className="font-semibold">Amount</p>
                <button
                  className="bg-[#451900] text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#987772] hover:text-[#451900]"
                  onClick={() => handleChangeAmount("decrease")}
                >
                  -
                </button>
                <span className="text-lg w-6 text-center">{amount}</span>
                <button
                  className="bg-[#451900] text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#987772] hover:text-[#451900]"
                  onClick={() => handleChangeAmount("increase")}
                >
                  +
                </button>
              </div>

              {/* Kombinasi bunga */}
              <div className="mt-6">
                <p className="font-medium mb-2 text-center md:text-left">
                  Flower combinations that go well with this flower
                </p>

                <div className="flex gap-3 flex-wrap justify-center md:justify-start">
                  {flower.combination?.length > 0 ? (
                    flower.combination.map((comboName, i) => {
                      const comboFlower = flowers.find(
                        (f) =>
                          f.name.toLowerCase() === comboName.toLowerCase()
                      );

                      return (
                        <div
                          key={i}
                          className="bg-[#f4eceb] p-2 rounded-xl text-center shadow-sm cursor-pointer hover:scale-105 transition-transform w-[100px]"
                          onClick={() =>
                            comboFlower && onSelectFlower(comboFlower)
                          }
                        >
                          {comboFlower ? (
                            <>
                              <Image
                                src={comboFlower.image}
                                alt={comboFlower.name}
                                width={80}
                                height={80}
                                className="mx-auto rounded-md"
                              />
                              <p className="text-sm mt-1 truncate font-serif">
                                {comboFlower.name}
                              </p>
                            </>
                          ) : (
                            <>
                              <div className="w-[80px] h-[80px] bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-600">
                                {comboName}
                              </div>
                              <p className="text-sm mt-1 text-gray-600">
                                (not in list)
                              </p>
                            </>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No combination recommendations available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tombol aksi di bawah (selalu terlihat) */}
        <div className="sticky bottom-0 left-0 bg-[#fff8f7] border-t border-gray-300 mt-4 pt-3 pb-4 flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4">
          <button
            onClick={() => {
              if (!isLoggedIn) {
                setShowLoginModal(true);
                return;
              }
              handleAddClick();
            }}
            className="bg-white border border-[#451900] text-[#451900] rounded-xl px-4 py-2 flex items-center justify-center gap-2 hover:bg-[#987772] hover:text-[#451900] transition"
          >
            Add to Cart
          </button>

          <button
            onClick={() => setShowPayment(true)}
            className="bg-[#451900] text-white px-6 py-2 rounded-xl shadow hover:bg-[#987772] hover:text-[#451900] transition"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Preview gambar penuh */}
      {showImage && (
        <div
          onClick={() => setShowImage(null)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] cursor-zoom-out"
        >
          <Image
            src={showImage}
            alt="preview"
            width={800}
            height={800}
            className="rounded-xl max-w-[90%] max-h-[90%] object-contain shadow-2xl"
          />
        </div>
      )}

      {showPayment && (
        <PaymentPopup
          total={flower.price * amount}
          cartItems={[{ ...flower, qty: amount }]}
          onClose={() => setShowPayment(false)}
          onConfirm={() => {
            setShowPayment(false);
            onClose();
          }}
        />
      )}

      {/* Popup jika belum login */}
      <LoginRequiredModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
