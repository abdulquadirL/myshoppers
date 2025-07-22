'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

// Sample testimonials data
const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Regular Customer',
    image: 'https://randomuser.me/api/portraits/women/32.jpg',
    rating: 5,
    text: 'The personal shopper service is amazing! I get all my favorite products from the local market without leaving home. The chat feature made it easy to request specific items that weren\'t listed.',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Personal Shopper',
    image: 'https://randomuser.me/api/portraits/men/75.jpg',
    rating: 5,
    text: 'Working as a personal shopper has been a great experience. The platform is easy to use, and I enjoy helping customers get quality products from our local markets.',
  },
  {
    id: 3,
    name: 'Alicia Rodriguez',
    role: 'Market Owner',
    image: 'https://randomuser.me/api/portraits/women/67.jpg',
    rating: 4,
    text: 'Since joining LocalMarket, our business has grown significantly. We\'re reaching more customers through the platform, and the admin dashboard helps us manage our inventory efficiently.',
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'Regular Customer',
    image: 'https://randomuser.me/api/portraits/men/41.jpg',
    rating: 5,
    text: 'The variety of products available is impressive. I\'ve discovered so many great local vendors I didn\'t know existed. My personal shopper always selects the freshest items!',
  },
  {
    id: 5,
    name: 'Emma Wilson',
    role: 'Personal Shopper',
    image: 'https://randomuser.me/api/portraits/women/8.jpg',
    rating: 5,
    text: 'I love the flexibility of being a personal shopper. The app makes it easy to manage pickups and communicate with customers. The invoice upload feature is particularly helpful.',
  },
];

const TestimonialsSection = () => {
  // Render star ratings
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`h-5 w-5 ${
              index < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">What Our Users Say</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hear from customers, personal shoppers, and market owners
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/2">
                  <div className="p-2">
                    <Card className="h-full">
                      <CardContent className="flex flex-col p-6">
                        <div className="mb-4">{renderStars(testimonial.rating)}</div>
                        <p className="flex-1 text-muted-foreground mb-6 italic">
                          "{testimonial.text}"
                        </p>
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                            <img 
                              src={testimonial.image} 
                              alt={testimonial.name}
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold">{testimonial.name}</h4>
                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline">
            <a href="/signup">Join LocalMarket Today</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;