import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);

  const fetchCart = useCallback(async () => {
    try {
      const { data } = await api.get('/cart');
      setCart({ ...data, items: data.items ?? [] });
    } catch {}
  }, []);

  const addToCart = async (productId, quantity = 1, selectedImage = null) => {
    try {
      await api.post('/cart/add', { productId, quantity, selectedImage });
      toast.success('Added to cart!');
      fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await api.delete(`/cart/remove/${itemId}`);
      fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await api.put(`/cart/update/${itemId}`, { quantity });
      fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const cartCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, removeFromCart, updateQuantity, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
