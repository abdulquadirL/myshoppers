'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { MapPinIcon, StarIcon } from 'lucide-react';
import { Market } from '@/types';
import { supabase } from '@/lib/supabase/client';

// Sample data in case Supabase is not fully set up
const SAMPLE_MARKETS: Market[] = [
  {
    id: '1',
    name: 'Central Farmer\'s Market',
    description: 'The largest farmer\'s market with fresh local produce.',
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: '123 Market St, New York, NY'
    },
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80',
    categories: ['Produce', 'Dairy', 'Bakery', 'Meat'],
    rating: 4.8,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Harbor Fish Market',
    description: 'Fresh seafood directly from local fishermen.',
    location: {
      latitude: 40.7228,
      longitude: -73.9867,
      address: '456 Harbor Dr, Brooklyn, NY'
    },
    image: 'https://images.unsplash.com/photo-1513125670-8b5d9869e617?auto=format&fit=crop&q=80',
    categories: ['Seafood', 'Fresh Fish'],
    rating: 4.5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Greenfield Organic Market',
    description: 'All organic and locally sourced products.',
    location: {
      latitude: 40.6892,
      longitude: -73.9081,
      address: '789 Green Ave, Queens, NY'
    },
    image: 'https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&q=80',
    categories: ['Organic', 'Vegan', 'Gluten-Free'],
    rating: 4.7,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Riverside Meat & Deli',
    description: 'Premium cuts of meat and specialty deli items.',
    location: {
      latitude: 40.8591,
      longitude: -73.9352,
      address: '321 River Rd, Bronx, NY'
    },
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80',
    categories: ['Meat', 'Deli', 'Specialty'],
    rating: 4.6,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const MarketHighlights = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        // Try to fetch from Supabase
        const { data, error } = await supabase
          .from('markets')
          .select('*')
          .eq('is_active', true)
          .order('rating', { ascending: false })
          .limit(4);

        if (error || !data || data.length === 0) {
          // If error or no data, use sample data
          setMarkets(SAMPLE_MARKETS);
        } else {
          // Map the data to match our Market type
          const formattedData: Market[] = data.map(market => ({
            id: market.id,
            name: market.name,
            description: market.description,
            location: market.location,
            image: market.image,
            categories: market.categories,
            rating: market.rating,
            isActive: market.is_active,
            createdAt: market.created_at,
            updatedAt: market.updated_at
          }));
          setMarkets(formattedData);
        }
      } catch (error) {
        console.error("Error fetching markets:", error);
        // Use sample data as fallback
        setMarkets(SAMPLE_MARKETS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarkets();
  }, []);

  // Function to render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <section className="py-16" id="markets">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Markets</h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Discover the best local markets in your area
            </p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0">
            <Link href="/markets">View All Markets</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {markets.map((market) => (
              <Card key={market.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={market.image} 
                    alt={market.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                  <div className="absolute top-2 right-2">
                    {renderStars(market.rating)}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{market.name}</h3>
                  <div className="flex items-start mb-3">
                    <MapPinIcon className="h-4 w-4 text-muted-foreground mt-0.5 mr-1 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground truncate">
                      {market.location.address}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {market.categories.slice(0, 3).map((category) => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                    {market.categories.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{market.categories.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <Button asChild className="w-full">
                    <Link href={`/markets/${market.id}`}>
                      View Products
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MarketHighlights;