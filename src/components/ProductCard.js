import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAdd = () => {
    if (!user) { navigate('/login'); return; }
    addToCart(product.id);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl || `https://picsum.photos/seed/${product.id}/400/250`}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
        />
        <span className="absolute top-3 left-3 bg-white text-blue-600 text-xs font-semibold px-2 py-1 rounded-full border border-blue-100 shadow-sm">
          {product.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate mb-1">{product.name}</h3>
        <p className="text-gray-400 text-xs mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600">₹{product.price}</span>
          <button onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition">
            Add to Cart
          </button>
        </div>
        <p className="text-gray-400 text-xs mt-2">{product.stock} in stock</p>
      </div>
    </div>
  );
}
