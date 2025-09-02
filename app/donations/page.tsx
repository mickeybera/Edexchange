"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Plus, Heart, BookOpen, Calculator, Microscope, Wrench } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import BorrowModal from '@/components/donations/borrow-modal';
import { toast } from 'sonner';

const ThreeBackground = dynamic(() => import('@/components/background/three-background'), { 
  ssr: false 
});

interface DonatedItem {
  _id: string;
  title: string;
  donorName: string;
  category: string;
  condition: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  available: boolean;
  borrowedBy?: string;
  borrowedAt?: string;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'books':
      return BookOpen;
    case 'electronics':
      return Calculator;
    case 'lab-equipment':
      return Microscope;
    case 'tools':
      return Wrench;
    default:
      return BookOpen;
  }
};

const getCategoryDisplayName = (category: string) => {
  switch (category) {
    case 'books':
      return 'Books';
    case 'electronics':
      return 'Electronics';
    case 'clothing':
      return 'Clothing';
    case 'furniture':
      return 'Furniture';
    case 'sports':
      return 'Sports Equipment';
    case 'stationery':
      return 'Stationery';
    case 'lab-equipment':
      return 'Lab Equipment';
    case 'tools':
      return 'Tools';
    case 'other':
      return 'Other';
    default:
      return category;
  }
};

export default function DonationsPage() {
  const [donatedItems, setDonatedItems] = useState<DonatedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<DonatedItem | null>(null);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);

  useEffect(() => {
    fetchDonatedItems();
  }, []);

  const fetchDonatedItems = async () => {
    try {
      const response = await fetch('/api/donated-items');
      if (!response.ok) {
        throw new Error('Failed to fetch donated items');
      }
      const data = await response.json();
      setDonatedItems(data.donatedItems || []);
    } catch (error) {
      console.error('Error fetching donated items:', error);
      toast.error('Failed to load donated items');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = (item: DonatedItem) => {
    if (!item.available) {
      toast.error('This item is currently not available');
      return;
    }
    setSelectedItem(item);
    setIsBorrowModalOpen(true);
  };

  const handleBorrowSubmit = async (formData: any) => {
    if (!selectedItem) return;

    try {
      const response = await fetch(`/api/donated-items/${selectedItem._id}/borrow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to borrow item');
      }

      toast.success(`Borrow request submitted for ${selectedItem.title}!`);
      setIsBorrowModalOpen(false);
      setSelectedItem(null);
      
      // Refresh the items list
      fetchDonatedItems();
    } catch (error) {
      console.error('Error borrowing item:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to borrow item');
    }
  };

  if (loading) {
    return (
      <>
        <ThreeBackground />
        <Navbar />
        <main className="min-h-screen pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading donated items...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center space-x-2">
                  <Heart className="h-8 w-8 text-red-500" />
                  <span>Donations</span>
                </h1>
                <p className="text-muted-foreground">
                  Borrow donated items from generous students in our community
                </p>
              </div>
              <Link href="/donate">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Donate Item
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          >
            <Card className="backdrop-blur-sm bg-background/80 text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{donatedItems.length}</div>
                <div className="text-sm text-muted-foreground">Total Items</div>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-sm bg-background/80 text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {donatedItems.filter(item => item.available).length}
                </div>
                <div className="text-sm text-muted-foreground">Available</div>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-sm bg-background/80 text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">
                  {donatedItems.filter(item => !item.available).length}
                </div>
                <div className="text-sm text-muted-foreground">Borrowed</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Donated Items Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {donatedItems.map((item, index) => {
              const IconComponent = getCategoryIcon(item.category);
              
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.1 }}
                  className="scroll-range-animation"
                >
                  <Card className={`group enhanced-card-shadow backdrop-blur-sm bg-background/80 border-border/50 ${
                    !item.available ? 'opacity-75' : ''
                  }`}>
                    <CardHeader className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={item.imageUrl || 'https://via.placeholder.com/300'}
                          alt={item.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge 
                          className={`absolute top-2 right-2 ${
                            item.available ? 'bg-green-500' : 'bg-red-500'
                          } text-white`}
                        >
                          {item.available ? 'Available' : 'Borrowed'}
                        </Badge>
                        <Badge 
                          className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm"
                          variant="secondary"
                        >
                          {item.condition}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <IconComponent className="h-4 w-4 text-primary" />
                        <Badge variant="outline">{getCategoryDisplayName(item.category)}</Badge>
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Donated by {item.donorName}
                        </span>
                        <span className="text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-4 pt-0">
                      <Button 
                        className="w-full" 
                        onClick={() => handleBorrow(item)}
                        disabled={!item.available}
                      >
                        {item.available ? 'Borrow' : 'Not Available'}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {donatedItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <Heart className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">No donations yet</h2>
              <p className="text-muted-foreground mb-6">
                Be the first to donate and help your fellow students
              </p>
              <Link href="/donate">
                <Button>Donate Your First Item</Button>
              </Link>
            </motion.div>
          )}
        </div>
      </main>

      <BorrowModal
        isOpen={isBorrowModalOpen}
        onClose={() => setIsBorrowModalOpen(false)}
        item={selectedItem}
        onSubmit={handleBorrowSubmit}
      />

      <Footer />
    </>
  );
}