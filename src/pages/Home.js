import { Link } from 'react-router-dom';
import logo from '../logo.jpeg';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Welcome to</p>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
            Robin Club
          </h1>
          <p className="text-gray-500 text-lg mb-8 max-w-md">
            Discover amazing products at unbeatable prices. Shop smarter, live better.
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition shadow-sm">
              Shop Now
            </Link>
            <Link to="/register" className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-semibold transition">
              Get Started
            </Link>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="w-48 h-48 rounded-full overflow-hidden ring-4 ring-blue-100 shadow-xl">
            <img src={logo} alt="Robin Club" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🚀', title: 'Fast Delivery', desc: 'Get your orders delivered quickly to your doorstep.' },
            { icon: '🔒', title: 'Secure Payments', desc: 'Your payment information is always safe with us.' },
            { icon: '💎', title: 'Premium Quality', desc: 'Only the best products curated for our members.' },
          ].map(f => (
            <div key={f.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <span className="text-4xl mb-4 block">{f.icon}</span>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
