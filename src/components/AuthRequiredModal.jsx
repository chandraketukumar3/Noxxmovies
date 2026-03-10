import { createPortal } from 'react-dom'

const AuthRequiredModal = ({ onClose }) => {
  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0B0B0F]/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative bg-[#12121A] p-8 rounded-2xl border border-white/10 shadow-2xl max-w-sm w-full text-center animate-scale-in">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold mb-2 text-white">Sign In Required</h2>
        <p className="text-[#A1A1AA] mb-8">
          Please sign in to your account to play trailers and access exclusive content.
        </p>
        
        <div className="flex flex-col gap-3">
          <a
            href="/login"
            className="btn-primary justify-center py-3 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign In Now
          </a>
          <button
            onClick={onClose}
            className="text-[#A1A1AA] hover:text-white transition-colors py-2 text-sm font-semibold"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.getElementById('modal-root'))
}

export default AuthRequiredModal
