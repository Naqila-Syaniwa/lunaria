"use client";
export default function LoginRequiredModal({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-md text-center font-dm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Login Required</h2>
        <p className="text-gray-600 mb-6">You must log in first to access this page.</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => window.location.assign("/login")}
            className="bg-gradient-to-r from-[#CA217C] to-[#E1688B] text-white px-5 py-2.5 rounded-xl font-medium hover:scale-105 transition-all"
          >
            Log In
          </button>
          <button
            onClick={onClose}
            className="border border-gray-300 px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
