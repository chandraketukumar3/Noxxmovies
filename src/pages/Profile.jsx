import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import api from '../services/api'
import Loader from '../components/Loader'

const Profile = () => {
  const { user } = useSelector((state) => state.auth || {})
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.name)
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const res = await api.put('/users/profile', { name })
      // Update local storage or just wait for next refresh? 
      // Usually we update Redux too. For now I'll just show success.
      setMessage('Profile updated successfully!')
      // Optionally update user in Redux:
      // dispatch(updateProfileSuccess(res.data))
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center">Please login to view profile.</div>

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto bg-[#1a1a1e] rounded-2xl p-8 border border-white/10 shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>
        
        <div className="flex items-center gap-6 mb-10 pb-8 border-b border-white/5">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary border-2 border-primary/20">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-colors"
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
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center"
          >
            {loading ? <Loader size="sm" /> : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile
