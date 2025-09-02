"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Search, Filter, ShoppingCart, Loader2, Star, BookOpen, Ruler, Weight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RatingDisplay, RatingBadge } from '@/components/ui/rating-display';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import FloatingActionButton from '@/components/ui/floating-action-button';
import { useCart } from '@/contexts/cart-context';
import { useDatabase } from '@/hooks/use-database';
import { toast } from 'sonner';

const ThreeBackground = dynamic(() => import('@/components/background/three-background'), { 
  ssr: false 
});

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  status: string;
  location: string;
  images: string[];
  views: number;
  likes: string[];
  createdAt: string;
  
  // Enhanced item details
  brand?: string;
  model?: string;
  year?: number;
  edition?: string;
  isbn?: string;
  publisher?: string;
  author?: string;
  pages?: number;
  language?: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };
  weight?: {
    value: number;
    unit: string;
  };
  
  // Ratings and reviews
  averageRating?: number;
  totalRatings?: number;
  
  // Additional details
  warranty?: string;
  returnPolicy?: string;
  shippingInfo?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    preferredContact?: string;
  };
  
  sellerId: {
    username: string;
    firstName: string;
    lastName: string;
  };
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { dispatch } = useCart();
  const { get, loading, error } = useDatabase();

  const categories = ['All', 'Books', 'Engineering Kits', 'Notes', 'Others'];

  // Fetch listings from database
  const fetchListings = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Fetching listings for home page...');
      
      const response = await get('/api/listings');
      console.log('✅ Home page listings fetched:', response);
      
      if (response.listings) {
        setListings(response.listings);
      } else {
        setListings([]);
      }
    } catch (err: any) {
      console.error('❌ Error fetching listings for home page:', err);
      toast.error('Failed to load listings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (listing.brand && listing.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (listing.author && listing.author.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (listing: Listing) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: listing._id,
        title: listing.title,
        price: listing.price,
        image: listing.images[0] || 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400',
        seller: `${listing.sellerId.firstName} ${listing.sellerId.lastName}`,
        category: listing.category
      }
    });
    toast.success(`${listing.title} added to cart!`);
  };

  const formatDimensions = (dimensions: any) => {
    if (!dimensions) return null;
    const parts = [];
    if (dimensions.length) parts.push(`L: ${dimensions.length}${dimensions.unit}`);
    if (dimensions.width) parts.push(`W: ${dimensions.width}${dimensions.unit}`);
    if (dimensions.height) parts.push(`H: ${dimensions.height}${dimensions.unit}`);
    return parts.join(' × ');
  };

  const formatWeight = (weight: any) => {
    if (!weight) return null;
    return `${weight.value} ${weight.unit}`;
  };

  return (
    <>
      <ThreeBackground />
      <Navbar />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Student Marketplace
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Buy and sell books, kits, and study materials with fellow students
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search books, kits, notes, brands, authors..."
                    className="pl-12 pr-4 py-3 text-lg rounded-full backdrop-blur-sm bg-background/80"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="rounded-full"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  Error: {error}
                </div>
              </motion.div>
            )}

            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin" />
                <p className="text-muted-foreground">Loading listings...</p>
              </motion.div>
            ) : (
              <>
                <div className="mb-6 text-sm text-muted-foreground">
                  {filteredListings.length} items found
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredListings.map((listing, index) => (
                    <motion.div
                      key={listing._id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ delay: index * 0.1 }}
                      className="scroll-range-animation"
                    >
                      <Card className="group enhanced-card-shadow backdrop-blur-sm bg-background/80 border-border/50">
                        <CardHeader className="p-0">
                          <div className="relative overflow-hidden rounded-t-lg">
                            <img
                              src={listing.images[0] || 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400'}
                              alt={listing.title}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                              <Badge 
                                className="bg-background/80 backdrop-blur-sm"
                                variant="secondary"
                              >
                                {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1).replace('-', ' ')}
                              </Badge>
                              <RatingBadge 
                                rating={listing.averageRating || 0} 
                                totalRatings={listing.totalRatings || 0} 
                              />
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                            {listing.title}
                          </h3>
                          
                          {/* Enhanced item details */}
                          <div className="space-y-2 mb-3">
                            {listing.brand && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <span className="font-medium">Brand:</span>
                                <span>{listing.brand}</span>
                              </div>
                            )}
                            {listing.author && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <BookOpen className="h-3 w-3" />
                                <span>{listing.author}</span>
                              </div>
                            )}
                            {listing.edition && (
                              <div className="text-sm text-muted-foreground">
                                {listing.edition}
                              </div>
                            )}
                            {listing.dimensions && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Ruler className="h-3 w-3" />
                                <span>{formatDimensions(listing.dimensions)}</span>
                              </div>
                            )}
                            {listing.weight && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Weight className="h-3 w-3" />
                                <span>{formatWeight(listing.weight)}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl font-bold text-primary">
                              ₹{listing.price}
                            </span>
                            <Badge variant="outline">{listing.category}</Badge>
                          </div>
                          
                          {/* Rating display */}
                          <div className="mb-2">
                            <RatingDisplay 
                              rating={listing.averageRating || 0} 
                              totalRatings={listing.totalRatings || 0}
                              size="sm"
                            />
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-1">
                            Sold by {listing.sellerId.firstName} {listing.sellerId.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {listing.location}
                          </p>
                        </CardContent>
                        
                        <CardFooter className="p-4 pt-0 space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleAddToCart(listing)}
                            disabled={loading}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Button size="sm" className="flex-1">
                            Buy Now
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>

                {filteredListings.length === 0 && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <h3 className="text-xl font-semibold mb-2">No items found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <FloatingActionButton />
      <Footer />
    </>
  );
}