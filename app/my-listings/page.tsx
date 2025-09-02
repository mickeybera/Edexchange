"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Plus, Edit, Eye, Heart, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { useUser, SignInButton } from '@clerk/nextjs';
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

export default function MyListingsPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { get, del, loading, error } = useDatabase();
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user's listings
  const fetchMyListings = async () => {
    if (!isSignedIn) return;
    
    try {
      setIsLoading(true);
      console.log('🔍 Fetching user listings...');
      
      // Get current user's listings
      const response = await get('/api/listings?sellerId=me');
      console.log('✅ User listings fetched:', response);
      
      if (response.listings) {
        setListings(response.listings);
      } else {
        setListings([]);
      }
    } catch (err: any) {
      console.error('❌ Error fetching listings:', err);
      toast.error('Failed to load your listings');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete listing
  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      await del(`/api/listings/${listingId}`);
      toast.success('Listing deleted successfully');
      fetchMyListings(); // Refresh the list
    } catch (err: any) {
      console.error('❌ Error deleting listing:', err);
      toast.error('Failed to delete listing');
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchMyListings();
    }
  }, [isSignedIn]);

  if (!isLoaded) {
    return (
      <>
        <ThreeBackground />
        <Navbar />
        <main className="min-h-screen pt-24 pb-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading listings...</p>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!isSignedIn) {
    return (
      <>
        <ThreeBackground />
        <Navbar />
        <main className="min-h-screen pt-24 pb-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-2xl font-bold mb-4">Please sign in to view your listings</h1>
              <p className="text-muted-foreground mb-6">
                Sign in to manage your listings and track their performance.
              </p>
              <SignInButton mode="modal">
                <Button size="lg">Sign In</Button>
              </SignInButton>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'sold':
        return 'bg-gray-500';
      case 'inactive':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredListings = listings.filter(listing => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return listing.status === 'active';
    if (activeTab === 'sold') return listing.status === 'sold';
    return true;
  });

  const activeListings = listings.filter(l => l.status === 'active');
  const soldListings = listings.filter(l => l.status === 'sold');

  return (
    <>
      <ThreeBackground />
      <Navbar />
      
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">My Listings</h1>
                <p className="text-muted-foreground">
                  Manage your posted items and track their performance
                </p>
              </div>
              <Link href="/sell">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Item
                </Button>
              </Link>
            </div>
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-md">
                <TabsTrigger value="all">All ({listings.length})</TabsTrigger>
                <TabsTrigger value="active">
                  Active ({activeListings.length})
                </TabsTrigger>
                <TabsTrigger value="sold">
                  Sold ({soldListings.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-6">
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin" />
                    <p className="text-muted-foreground">Loading your listings...</p>
                  </motion.div>
                ) : filteredListings.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <div className="mb-4">
                      <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                        <Plus className="h-12 w-12 text-muted-foreground" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No listings found</h3>
                    <p className="text-muted-foreground mb-6">
                      {activeTab === 'all' 
                        ? "You haven't posted any items yet"
                        : `No ${activeTab} listings found`
                      }
                    </p>
                    <Link href="/sell">
                      <Button>Post Your First Item</Button>
                    </Link>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredListings.map((listing, index) => (
                      <motion.div
                        key={listing._id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="group hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-background/80 border-border/50">
                          <CardHeader className="p-0">
                            <div className="relative overflow-hidden rounded-t-lg">
                              <img
                                src={listing.images[0] || 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400'}
                                alt={listing.title}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <Badge 
                                className={`absolute top-2 right-2 ${getStatusColor(listing.status)} text-white`}
                              >
                                {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                              </Badge>
                              <Badge 
                                className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm"
                                variant="secondary"
                              >
                                {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1).replace('-', ' ')}
                              </Badge>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                              {listing.title}
                            </h3>
                            
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-2xl font-bold text-primary">
                                ₹{listing.price}
                              </span>
                              <Badge variant="outline">{listing.category}</Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2">
                              {listing.location}
                            </p>
                            
                            {/* Stats */}
                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                              <div className="flex items-center space-x-1">
                                <Eye className="h-4 w-4" />
                                <span>{listing.views}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Heart className="h-4 w-4" />
                                <span>{listing.likes.length}</span>
                              </div>
                              <span>Posted {new Date(listing.createdAt).toLocaleDateString()}</span>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteListing(listing._id)}
                                disabled={loading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}