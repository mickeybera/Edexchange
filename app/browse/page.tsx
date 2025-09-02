"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
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
  sellerId: {
    username: string;
    firstName: string;
    lastName: string;
  };
}

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { dispatch } = useCart();
  const { get, loading, error } = useDatabase();

  const categories = ['All', 'Books', 'Engineering Kits', 'Notes', 'Others'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'condition', label: 'Condition' }
  ];

  // Fetch listings from database
  const fetchListings = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Fetching listings...');
      
      const response = await get('/api/listings');
      console.log('✅ Listings fetched:', response);
      
      if (response.listings) {
        setListings(response.listings);
      } else {
        setListings([]);
      }
    } catch (err: any) {
      console.error('❌ Error fetching listings:', err);
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
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'condition':
        const conditionOrder = { 'new': 1, 'like-new': 2, 'good': 3, 'fair': 4, 'poor': 5 };
        return (conditionOrder[a.condition as keyof typeof conditionOrder] || 0) - 
               (conditionOrder[b.condition as keyof typeof conditionOrder] || 0);
      default:
        return 0;
    }
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

  return (
    <>
      <ThreeBackground />
      <Navbar />
      
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Browse Items</h1>
            <p className="text-muted-foreground">
              Discover books, kits, and study materials from students
            </p>
          </motion.div>

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

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 space-y-4"
          >
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search items..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters and Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-4 text-sm text-muted-foreground">
              {isLoading ? 'Loading...' : `${filteredListings.length} items found`}
            </div>

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
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {sortedListings.map((listing, index) => (
                  <motion.div
                    key={listing._id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: index * 0.1 }}
                    className="scroll-range-animation"
                  >
                    <Card className={`group enhanced-card-shadow backdrop-blur-sm bg-background/80 border-border/50 ${
                      viewMode === 'list' ? 'flex-row flex' : ''
                    }`}>
                      <CardHeader className="p-0">
                        <div className={`relative overflow-hidden ${
                          viewMode === 'list' ? 'w-48 h-full rounded-l-lg' : 'rounded-t-lg'
                        }`}>
                          <img
                            src={listing.images[0] || 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400'}
                            alt={listing.title}
                            className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                              viewMode === 'list' ? 'w-full h-full' : 'w-full h-48'
                            }`}
                          />
                          <Badge 
                            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                            variant="secondary"
                          >
                            {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1).replace('-', ' ')}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <div className="flex-1 flex flex-col">
                        <CardContent className="p-4 flex-1">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                            {listing.title}
                          </h3>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl font-bold text-primary">
                              ₹{listing.price}
                            </span>
                            <Badge variant="outline">{listing.category}</Badge>
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
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {!isLoading && filteredListings.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <h3 className="text-xl font-semibold mb-2">No items found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}