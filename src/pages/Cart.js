import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, fetchCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [showCheckout, setShowCheckout] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const items = cart?.items ?? [];
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handleCheckout = async () => {
    if (!address.trim()) { toast.error('Please enter shipping address'); return; }
    if (!phone.trim()) { toast.error('Please enter phone number'); return; }
    setPaying(true);
    try {
      // 1. Place order
      const { data: order } = await api.post('/orders', {
        shippingAddress: `${address} | Phone: ${phone}`
      });

      // 2. Create Razorpay order on backend
      const { data: rzpData } = await api.post(`/payments/create/${order.id}`);

      // 3. Open Razorpay checkout
      const options = {
        key: rzpData.keyId,
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: 'Robin Club',
        description: `Order #${order.id}`,
        order_id: rzpData.razorpayOrderId,
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: phone,
        },
        theme: { color: '#2563EB' },
        handler: async (response) => {
          try {
            // 4. Verify payment signature on backend
            await api.post('/payments/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success('Payment successful! 🎉');
            fetchCart();
            navigate('/orders');
          } catch {
            toast.error('Payment verification failed');
          }
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
            toast.error('Payment cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setPaying(false);
      });
      rzp.open();

    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
      setPaying(false);
    }
  };

  if (!cart || items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-6xl mb-4">🛒</p>
        <p className="text-gray-900 text-xl font-semibold mb-2">Your cart is empty</p>
        <p className="text-gray-500 text-sm mb-6">Add some products to get started</p>
        <button onClick={() => navigate('/products')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition">
          Browse Products
        </button>
      </div>
    );
  }

  const inputCls = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Your Cart</h2>
      <div className="grid md:grid-cols-3 gap-6">

        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-4 bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
              <img
                src={item.product.imageUrl || `https://picsum.photos/seed/${item.product.id}/80/80`}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-lg border border-gray-100"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{item.product.name}</p>
                <p className="text-gray-400 text-sm">{item.product.category}</p>
                <p className="text-blue-600 font-bold mt-1">₹{(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-gray-600 text-sm bg-gray-100 px-3 py-1 rounded-lg">Qty: {item.quantity}</span>
                <button onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-600 text-xs transition font-medium">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 h-fit shadow-sm sticky top-24">
          <h3 className="text-gray-900 font-bold text-lg mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm text-gray-500">
                <span className="truncate mr-2">{item.product.name} ×{item.quantity}</span>
                <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-4 mb-5">
            <div className="flex justify-between text-gray-900 font-bold text-lg">
              <span>Total</span>
              <span className="text-blue-600">₹{total.toFixed(2)}</span>
            </div>
          </div>

          {showCheckout ? (
            <div className="space-y-3">
              <div>
                <label className="text-gray-700 text-xs font-medium mb-1 block">Phone Number *</label>
                <input type="tel" placeholder="+91 9876543210" className={inputCls}
                  value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="text-gray-700 text-xs font-medium mb-1 block">Shipping Address *</label>
                <textarea placeholder="House no, Street, City, State, PIN..."
                  rows={3} className={inputCls}
                  value={address} onChange={e => setAddress(e.target.value)} />
              </div>

              {/* Payment methods info */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <p className="text-xs text-blue-700 font-medium mb-1">Accepted payments</p>
                <div className="flex gap-2 flex-wrap">
                  {['UPI', 'Cards', 'Net Banking', 'Wallets'].map(m => (
                    <span key={m} className="text-xs bg-white border border-blue-200 text-blue-600 px-2 py-0.5 rounded">{m}</span>
                  ))}
                </div>
              </div>

              <button onClick={handleCheckout} disabled={paying}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                {paying ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Processing...
                  </>
                ) : `Pay ₹${total.toFixed(2)}`}
              </button>
              <button onClick={() => setShowCheckout(false)}
                className="w-full text-gray-400 hover:text-gray-600 text-sm transition">
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => setShowCheckout(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition">
              Proceed to Checkout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
