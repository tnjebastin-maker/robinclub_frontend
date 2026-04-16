import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const emptyForm = { name: '', description: '', price: '', stock: '', category: '' };

const STATUS_STYLES = {
  PENDING: 'text-yellow-600', CONFIRMED: 'text-blue-600',
  SHIPPED: 'text-purple-600', DELIVERED: 'text-green-600', CANCELLED: 'text-red-600',
};

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('products');
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = () => api.get('/products').then(({ data }) => setProducts(data)).catch(() => {});
  const fetchOrders = () => api.get('/orders/all').then(({ data }) => setOrders(data)).catch(() => {});

  useEffect(() => { fetchProducts(); fetchOrders(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append('image', image);
    try {
      if (editId) { await api.put(`/admin/products/${editId}`, fd); toast.success('Product updated'); }
      else { await api.post('/admin/products', fd); toast.success('Product added'); }
      setForm(emptyForm); setImage(null); setEditId(null); setShowForm(false);
      fetchProducts();
    } catch { toast.error('Failed to save product'); }
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({ name: p.name, description: p.description || '', price: p.price, stock: p.stock, category: p.category });
    setShowForm(true); setTab('products');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Deleted');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const inputCls = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm";

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">Manage products and orders</p>
        </div>
        <div className="flex gap-2 text-sm">
          <span className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium">{products.length} Products</span>
          <span className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium">{orders.length} Orders</span>
        </div>
      </div>

      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {['products', 'orders'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-md text-sm font-medium capitalize transition ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        <>
          <div className="flex justify-end mb-4">
            <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition">
              {showForm ? 'Cancel' : '+ Add Product'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 mb-6 grid grid-cols-2 gap-4 shadow-sm">
              <h3 className="col-span-2 text-gray-900 font-bold text-lg">{editId ? 'Edit Product' : 'New Product'}</h3>
              <input placeholder="Product Name" required className={`${inputCls} col-span-2`} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <textarea placeholder="Description" rows={2} className={`${inputCls} col-span-2`} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <input type="number" placeholder="Price (₹)" required className={inputCls} value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              <input type="number" placeholder="Stock" required className={inputCls} value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
              <input placeholder="Category" required className={inputCls} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
              <input type="file" accept="image/*" className={inputCls} onChange={e => setImage(e.target.files[0])} />
              <button type="submit" className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition">
                {editId ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          )}

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.imageUrl || `https://picsum.photos/seed/${p.id}/50/50`} alt="" className="w-10 h-10 object-cover rounded-lg border border-gray-100" />
                        <span className="text-gray-900 font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.category}</td>
                    <td className="px-4 py-3 text-blue-600 font-semibold">₹{p.price}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.stock > 10 ? 'bg-green-50 text-green-700' : p.stock > 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-700 text-xs font-medium">Edit</button>
                        <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-600 text-xs font-medium">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && <div className="text-center py-12 text-gray-400">No products yet. Add your first product!</div>}
          </div>
        </>
      )}

      {tab === 'orders' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-900 font-medium">#{o.id}</td>
                  <td className="px-4 py-3 text-gray-500">{o.user?.email}</td>
                  <td className="px-4 py-3 text-blue-600 font-semibold">₹{o.totalAmount}</td>
                  <td className={`px-4 py-3 font-medium text-xs ${STATUS_STYLES[o.status]}`}>{o.status}</td>
                  <td className="px-4 py-3">
                    <select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)}
                      className="border border-gray-300 text-gray-700 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
                      {['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <div className="text-center py-12 text-gray-400">No orders yet</div>}
        </div>
      )}
    </div>
  );
}
