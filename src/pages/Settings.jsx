import { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../services/api'
import Loader from '../components/Loader'

const Settings = () => {
  const { user } = useSelector((state) => state.auth || {})
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return setMessage('Passwords do not match')
    }
    
    setLoading(true)
    setMessage('')
    try {
      await api.put('/users/profile', { password })
      setMessage('Password changed successfully!')
      setPassword('')
      setConfirmPassword('')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center">Please login to access settings.</div>

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto bg-[#1a1a1e] rounded-2xl p-8 border border-white/10 shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
        
        <div className="space-y-10">
          <section>
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Change Password
            </h2>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-colors"
                  minLength={6}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-colors"
                  minLength={6}
                  required
                />
              </div>

              {message && (
                <p className={`text-sm ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-6 rounded-xl transition-all flex items-center justify-center"
              >
                {loading ? <Loader size="sm" /> : 'Update Password'}
              </button>
            </form>
          </section>

          <section className="pt-8 border-t border-white/5">
            <h2 className="text-lg font-bold text-white mb-4">Account Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <p className="font-semibold text-white">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive alerts about new trending content</p>
                </div>
                <div className="w-12 h-6 bg-gray-700 rounded-full relative cursor-pointer opacity-50">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-gray-400 rounded-full" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Settings
