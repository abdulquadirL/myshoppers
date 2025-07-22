'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  marketId: string | null;
  addItem: (product: Product, quantity: number, notes?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setMarketId: (id: string) => void;
  total: number;
  itemCount: number;
  products?: Product[];
}


const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [marketId, setMarketId] = useState<string | null>(null);
  const { user } = useAuth();

  // Calculate totals
  const total = items.reduce(
    (sum, item) => sum + (item.product.discountPrice || item.product.price) * item.quantity, 
    0
  );
  
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  // Load cart from Supabase when user is available
  useEffect(() => {
    const loadCart = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('cart_items')
          .select(`
            id, 
            quantity, 
            notes, 
            product_id,
            products (*)
          `)
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Get market ID from first item
          const marketFromItems = data[0]?.products?.map(product => product.market_id)?.[0] || null;
          setMarketId(marketFromItems);
          
          // Map data to CartItem structure
          const cartItems: CartItem[] = data.map(item => ({
            id: item.id,
            productId: item.product_id,
            product: {
              id: item.product_id,
              marketId: item.products[0].market_id,
              name: item.products[0].name,
              description: item.products[0].description,
              price: item.products[0].price,
              discountPrice: item.products[0].discount_price,

              images: item.products[0].images,
              category: item.products[0].category,
              tags: item.products[0].tags,
              stock: item.products[0].stock,
              unit: item.products[0].unit,
              isAvailable: item.products[0].is_available,
              createdAt: item.products[0].created_at,
              updatedAt: item.products[0].updated_at,
            },
            quantity: item.quantity,
            notes: item.notes
          }));
          
          setItems(cartItems);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };
    
    loadCart();
  }, [user]);

  // Save cart to Supabase whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      if (!user) return;
      
      try {
        // First delete existing items
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);
        
        // Then insert new items
        if (items.length > 0) {
          const cartData = items.map(item => ({
            user_id: user.id,
            product_id: item.productId,
            quantity: item.quantity,
            notes: item.notes
          }));
          
          await supabase.from('cart_items').insert(cartData);
        }
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    };
    
    if (user) {
      saveCart();
    }
  }, [items, user]);

  const addItem = (product: Product, quantity: number, notes?: string) => {
    // Check if adding from a different market
    if (marketId && product.marketId !== marketId) {
      if (items.length > 0) {
        // Ask confirmation before clearing cart
        if (!confirm('You already have items from a different market. Do you want to clear your cart and add this item instead?')) {
          return;
        }
        
        // Clear cart and set new market
        setItems([]);
      }
      
      // Set the new market ID
      setMarketId(product.marketId);
    } else if (!marketId) {
      // First item, set market ID
      setMarketId(product.marketId);
    }
    
    setItems(prevItems => {
      // Check if item already exists
      const existingItemIndex = prevItems.findIndex(item => item.productId === product.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
        
        if (newQuantity > product.stock) {
          toast.error(`Sorry, only ${product.stock} items available in stock`);
          return prevItems;
        }
        
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity,
          notes: notes || updatedItems[existingItemIndex].notes
        };
        
        return updatedItems;
      } else {
        // Add new item
        if (quantity > product.stock) {
          toast.error(`Sorry, only ${product.stock} items available in stock`);
          return prevItems;
        }
        
        const newItem: CartItem = {
          id: `temp-${Date.now()}`, // Will be replaced by DB ID
          productId: product.id,
          product,
          quantity,
          notes
        };
        
        toast.success(`Added ${product.name} to cart`);
        return [...prevItems, newItem];
      }
    });
  };

  const removeItem = (itemId: string) => {
    setItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== itemId);
      
      // If cart becomes empty, reset market ID
      if (updatedItems.length === 0) {
        setMarketId(null);
      }
      
      return updatedItems;
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setItems(prevItems => {
      const itemIndex = prevItems.findIndex(item => item.id === itemId);
      
      if (itemIndex < 0) return prevItems;
      
      const item = prevItems[itemIndex];
      
      // Check stock limit
      if (quantity > item.product.stock) {
        toast.error(`Sorry, only ${item.product.stock} items available in stock`);
        return prevItems;
      }
      
      // If quantity is 0, remove item
      if (quantity <= 0) {
        return prevItems.filter(item => item.id !== itemId);
      }
      
      // Otherwise update quantity
      const updatedItems = [...prevItems];
      updatedItems[itemIndex] = { ...item, quantity };
      
      return updatedItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    setMarketId(null);
  };

  const value = {
    items,
    marketId,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setMarketId,
    total,
    itemCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};