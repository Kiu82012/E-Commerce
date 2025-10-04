import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE } from '../lib/config';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);

  // Fetch cart when user logs in
  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setCart({ items: [], total: 0, itemCount: 0 });
    }
  }, [token]);

  const fetchCart = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!token) {
      throw new Error('Please login to add items to cart');
    }

    try {
      const res = await fetch(`${API_BASE}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to add to cart');
      }

      await fetchCart(); // Refresh cart
      return data.cartItem;
    } catch (err) {
      console.error('Add to cart error:', err);
      throw err;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update cart');
      }

      await fetchCart(); // Refresh cart
      return data.cartItem;
    } catch (err) {
      console.error('Update cart error:', err);
      throw err;
    }
  };

  const removeFromCart = async (itemId) => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to remove from cart');
      }

      await fetchCart(); // Refresh cart
    } catch (err) {
      console.error('Remove from cart error:', err);
      throw err;
    }
  };

  const clearCart = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/cart`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to clear cart');
      }

      setCart({ items: [], total: 0, itemCount: 0 });
    } catch (err) {
      console.error('Clear cart error:', err);
      throw err;
    }
  };

  const value = useMemo(
    () => ({
      cart,
      loading,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      refreshCart: fetchCart
    }),
    [cart, loading, token]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
