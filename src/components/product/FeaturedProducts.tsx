'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { supabase } from '@/lib/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, PlusIcon } from 'lucide-react';

// Sample data in case Supabase is not fully set up
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    marketId: '1',
    name: 'Organic Avocados',
    description: 'Fresh organic avocados, ripe and ready to eat.',
    price: 2.99,
    discountPrice: 2.49,
    images: ['https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?auto=format&fit=crop&q=80'],
    category: 'Produce',
    tags: ['organic', 'fruit'],
    stock: 50,
    unit: 'each',
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    marketId: '2',
    name: 'Fresh Atlantic Salmon',
    description: 'Wild-caught Atlantic salmon fillet, never frozen.',
    price: 15.99,
    images: ['https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&q=80'],
    category: 'Seafood',
    tags: ['fish', 'fresh', 'protein'],
    stock: 20,
    unit: 'lb',
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    marketId: '3',
    name: 'Artisan Sourdough Bread',
    description: 'Freshly baked artisan sourdough bread, made with organic flour.',
    price: 5.99,
    discountPrice: 4.99,
    images: ['https://images.unsplash.com/photo-1586444248879-3270B4b0b3b1?auto=format&fit=crop&q=80'],
    category: 'Bakery',
    tags: ['bread', 'artisan', 'organic'],
    stock: 15,
    unit: 'loaf',
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    marketId: '4',
    name: 'Grass-fed Ribeye Steak',
    description: 'Premium 21-day aged grass-fed ribeye steak.',
    price: 24.99,
    images: ['https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80'],
    category: 'Meat',
    tags: ['beef', 'grass-fed', 'premium'],
    stock: 10,
    unit: 'lb',
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    marketId: '1',
    name: 'Local Honey',
    description: 'Raw unfiltered honey from local beekeepers.',
    price: 8.99,
    images: ['https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&q=80'],
    category: 'Pantry',
    tags: ['honey', 'local', 'raw'],
    stock: 30,
    unit: 'jar',
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    marketId: '3',
    name: 'Farm Fresh Eggs',
    description: 'Organic free-range eggs from pasture-raised hens.',
    price: 6.49,
    discountPrice: 5.99,
    images: ['https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&q=80'],
    category: 'Dairy',
    tags: ['eggs', 'organic', 'free-range'],
    stock: 25,
    unit: 'dozen',
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    marketId: '2',
    name: 'Heirloom Tomatoes',
    description: 'Locally grown heirloom tomatoes in various colors.',
    price: 4.99,
    images: ['https://images.unsplash.com/photo-1594057842-3683e29cb380?auto=format&fit=crop&q=80'],
    category: 'Produce',
    tags: ['tomatoes', 'heirloom', 'local'],
    stock: 40,
    unit: 'lb',
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    marketId: '4',
    name: 'Aged Cheddar Cheese',
    description: '2-year aged sharp cheddar cheese from local dairy farm.',
    price: 12.99,
    images: ['https://images.unsplash.com/photo-1589881133595-a3c085cb731d?auto=format&fit=crop&q=80'],
    category: 'Dairy',
    tags: ['cheese', 'cheddar', 'aged'],
    stock: 18,
    unit: 'lb',
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Try to fetch from Supabase
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_available', true)
          .order('created_at', { ascending: false })
          .limit(8);

        if (error || !data || data.length === 0) {
          // If error or no data, use sample data
          setProducts(SAMPLE_PRODUCTS);
        } else {
          // Map the data to match our Product type
          const formattedData: Product[] = data.map(product => ({
            id: product.id,
            marketId: product.market_id,
            name: product.name,
            description: product.description,
            price: product.price,
            discountPrice: product.discount_price,
            images: product.images,
            category: product.category,
            tags: product.tags,
            stock: product.stock,
            unit: product.unit,
            isAvailable: product.is_available,
            createdAt: product.created_at,
            updatedAt: product.updated_at
          }));
          setProducts(formattedData);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        // Use sample data as fallback
        setProducts(SAMPLE_PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Format price with discount
  const formatPrice = (price: number, discountPrice?: number) => {
    return (
      <div className="flex items-center gap-2">
        <span className={`font-medium ${discountPrice ? 'text-muted-foreground line-through' : ''}`}>
          ${price.toFixed(2)}
        </span>
        {discountPrice && (
          <span className="font-semibold text-primary">
            ${discountPrice.toFixed(2)}
          </span>
        )}
      </div>
    );
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Fresh products from our featured local markets
            </p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-muted animate-pulse" />
                <CardContent className="p-4">
                  <div className="h-4 w-3/4 bg-muted animate-pulse mb-2" />
                  <div className="h-3 bg-muted animate-pulse mb-4" />
                  <div className="h-3 w-1/2 bg-muted animate-pulse" />
                </CardContent>
                <CardFooter className="border-t p-4">
                  <div className="h-8 w-full bg-muted animate-pulse" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden transition-all hover:shadow-md">
                <Link href={`/products/${product.id}`} className="block relative h-48 overflow-hidden">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                  {product.discountPrice && (
                    <Badge className="absolute top-2 right-2 bg-primary">
                      {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                    </Badge>
                  )}
                </Link>
                <CardContent className="p-4">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    {formatPrice(product.price, product.discountPrice)}
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <div className="flex justify-between w-full gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/products/${product.id}`}>
                        Details
                      </Link>
                    </Button>
                    <Button 
                      onClick={() => addItem(product, 1)}
                      className="flex-1"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;