'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Loader2 } from 'lucide-react';

interface PurchaseModalProps {
  listing: {
    _id: string;
    title: string;
    price: number;
    description: string;
    images: string[];
  };
  trigger?: React.ReactNode;
}

export function PurchaseModal({ listing, trigger }: PurchaseModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    message: '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.buyerName || !formData.buyerEmail) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/listings/${listing._id}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process purchase');
      }

      toast({
        title: 'Success!',
        description: data.message || 'Purchase completed successfully. Check your email for confirmation.',
      });

      setIsOpen(false);
      setFormData({
        buyerName: '',
        buyerEmail: '',
        buyerPhone: '',
        message: '',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to process purchase. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Purchase Item
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase {listing.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Item Preview */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            {listing.images && listing.images.length > 0 && (
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div>
              <h3 className="font-semibold">{listing.title}</h3>
              <p className="text-2xl font-bold text-green-600">${listing.price.toFixed(2)}</p>
            </div>
          </div>

          {/* Purchase Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="buyerName">Full Name *</Label>
              <Input
                id="buyerName"
                name="buyerName"
                value={formData.buyerName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="buyerEmail">Email Address *</Label>
              <Input
                id="buyerEmail"
                name="buyerEmail"
                type="email"
                value={formData.buyerEmail}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div>
              <Label htmlFor="buyerPhone">Phone Number</Label>
              <Input
                id="buyerPhone"
                name="buyerPhone"
                type="tel"
                value={formData.buyerPhone}
                onChange={handleInputChange}
                placeholder="Enter your phone number (optional)"
              />
            </div>

            <div>
              <Label htmlFor="message">Message to Seller</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Add a message for the seller (optional)"
                rows={3}
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Confirm Purchase
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
