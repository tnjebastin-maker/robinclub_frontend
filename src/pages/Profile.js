import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import logo from '../logo.jpeg';

export default function Profile() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/user/profile', form);
      const token = localStorage.getItem('token');
      login({ ...user, name: data.name, phone: data.phone }, token);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-blue-100 shadow-md">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <img src={logo} alt="Robin Club" className="w-full h-full object-cover" />
              )}
            </div>
          </div>
          <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
          <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
          <span className={`inline-block mt-2 text-xs px-3 py-1 rounded-full font-semibold border ${user?.role === 'ADMIN' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
            {user?.role}
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-gray-900 font-bold text-lg mb-6">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-700 text-sm font-medium mb-1 block">Full Name</label>
              <input type="text" required className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="text-gray-700 text-sm font-medium mb-1 block">Email</label>
              <input type="email" disabled className={`${inputCls} bg-gray-50 cursor-not-allowed text-gray-400`} value={user?.email} />
            </div>
            <div>
              <label className="text-gray-700 text-sm font-medium mb-1 block">
                Phone Number
                {!user?.phone && <span className="ml-2 text-red-500 text-xs">⚠ Not set</span>}
              </label>
              <input type="tel" placeholder="+91 9876543210" className={inputCls} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition disabled:opacity-50 mt-1">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
