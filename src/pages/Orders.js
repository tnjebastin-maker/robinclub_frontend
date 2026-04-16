import { useEffect, useState } from 'react';
import api from '../api/axios';

const STATUS_STYLES = {
  PENDING:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  SHIPPED:   'bg-purple-50 text-purple-700 border-purple-200',
  DELIVERED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <p className="text-6xl mb-4">📦</p>
        <p className="text-gray-900 text-xl font-semibold mb-2">No orders yet</p>
        <p className="text-gray-500 text-sm">Your order history will appear here</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h2>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-900 font-bold">Order #{order.id}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${STATUS_STYLES[order.status]}`}>
                {order.status}
              </span>
            </div>
            <div className="space-y-1 mb-4">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm text-gray-500">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
              <span className="text-gray-400 text-sm">Total Amount</span>
              <span className="font-bold text-lg text-blue-600">₹{order.totalAmount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
