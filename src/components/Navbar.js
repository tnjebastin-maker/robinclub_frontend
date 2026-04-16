import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import logo from '../logo.jpeg';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <Link to="/" className="flex items-center gap-3">
        <img src={logo} alt="Robin Club" className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500" />
        <span className="text-xl font-bold text-gray-900 tracking-tight">Robin Club</span>
      </Link>

      <div className="flex items-center gap-6 text-sm font-medium">
        <Link to="/products" className="text-gray-600 hover:text-blue-600 transition">Products</Link>

        {user ? (
          <>
            <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/orders" className="text-gray-600 hover:text-blue-600 transition">Orders</Link>
            {user.role === 'ADMIN' && (
              <Link to="/admin" className="text-blue-600 hover:text-blue-700 font-semibold transition">Admin</Link>
            )}
            <div className="flex items-center gap-3">
              <Link to="/profile" className="relative">
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-blue-500">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <img src={logo} alt={user.name} className="w-full h-full object-cover" />
                  )}
                </div>
                {!user.phone && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" title="Phone number missing" />
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-4 py-1.5 rounded-lg text-sm transition"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 hover:text-blue-600 transition">Login</Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition font-semibold">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
