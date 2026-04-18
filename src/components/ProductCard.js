import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imgIndex, setImgIndex] = useState(0);
  const [zoom, setZoom] = useState(false);

  const allImages = product.images?.length > 0
    ? product.images
    : [product.imageUrl || `https://picsum.photos/seed/${product.id}/400/250`];

  const handleAdd = () => {
    if (!user) { navigate('/login'); return; }
    addToCart(product.id);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden group">
        <div className="relative overflow-hidden">
          <img
            src={allImages[imgIndex]}
            alt={product.name}
            onClick={() => setZoom(true)}
            className="w-full h-48 object-cover group-hover:scale-105 transition duration-300 cursor-zoom-in"
          />
          <span className="absolute top-3 left-3 bg-white text-blue-600 text-xs font-semibold px-2 py-1 rounded-full border border-blue-100 shadow-sm">
            {product.category}
          </span>
          {allImages.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); setImgIndex(i => (i - 1 + allImages.length) % allImages.length); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-6 h-6 flex items-center justify-center text-gray-700 shadow text-xs"
              >‹</button>
              <button
                onClick={e => { e.stopPropagation(); setImgIndex(i => (i + 1) % allImages.length); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-6 h-6 flex items-center justify-center text-gray-700 shadow text-xs"
              >›</button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {allImages.map((_, i) => (
                  <button key={i} onClick={() => setImgIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition ${i === imgIndex ? 'bg-white' : 'bg-white/50'}`} />
                ))}
              </div>
            </>
          )}
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

      {zoom && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4" onClick={() => setZoom(false)}>
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <img src={allImages[imgIndex]} alt={product.name} className="w-full rounded-xl object-contain max-h-[80vh] shadow-2xl" />
            {allImages.length > 1 && (
              <>
                <button onClick={() => setImgIndex(i => (i - 1 + allImages.length) % allImages.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center text-gray-800 shadow font-bold text-lg">‹</button>
                <button onClick={() => setImgIndex(i => (i + 1) % allImages.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center text-gray-800 shadow font-bold text-lg">›</button>
                <div className="flex justify-center gap-2 mt-3">
                  {allImages.map((img, i) => (
                    <img key={i} src={img} alt="" onClick={() => setImgIndex(i)}
                      className={`w-12 h-12 object-cover rounded-lg cursor-pointer border-2 transition ${i === imgIndex ? 'border-blue-500' : 'border-transparent opacity-60'}`} />
                  ))}
                </div>
              </>
            )}
            <button onClick={() => setZoom(false)}
              className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center font-bold shadow">×</button>
          </div>
        </div>
      )}
    </>
  );
}
