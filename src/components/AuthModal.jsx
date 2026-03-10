import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { closeAuthModal } from '../redux/slices/uiSlice'

const AuthModal = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isOpen, message } = useSelector((state) => state.ui.authModal)

  if (!isOpen) return null

  const handleAction = (path) => {
    dispatch(closeAuthModal())
    navigate(path)
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
        onClick={() => dispatch(closeAuthModal())}
      />
      
      {/* Modal Content */}
      <div 
        className="relative w-full max-w-md bg-[#1a1a1e] border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">Authentication Required</h2>
        <p className="text-gray-400 mb-8 max-w-xs">{message}</p>

        <div className="flex flex-col w-full gap-3">
          <button
            onClick={() => handleAction('/login')}
            className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20"
          >
            Login
          </button>
          <button
            onClick={() => handleAction('/signup')}
            className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all"
          >
            Sign Up
          </button>
          <button
            onClick={() => dispatch(closeAuthModal())}
            className="mt-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
