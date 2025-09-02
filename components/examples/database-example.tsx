"use client";

import { useState, useEffect } from 'react';
import { useDatabase } from '@/hooks/use-database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
}

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  status: string;
  sellerId: {
    username: string;
    firstName: string;
    lastName: string;
  };
}

export default function DatabaseExample() {
  const { get, post, loading, error } = useDatabase();
  const [users, setUsers] = useState<User[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      const data = await get('/api/users');
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // Fetch listings
  const fetchListings = async () => {
    try {
      const data = await get('/api/listings');
      setListings(data.listings);
    } catch (err) {
      console.error('Error fetching listings:', err);
    }
  };

  // Create new listing
  const createListing = async () => {
    try {
      await post('/api/listings', {
        ...newListing,
        price: parseFloat(newListing.price),
        condition: 'good',
        images: [],
        tags: [],
      });
      
      // Reset form
      setNewListing({
        title: '',
        description: '',
        price: '',
        category: '',
        location: '',
      });
      
      // Refresh listings
      fetchListings();
    } catch (err) {
      console.error('Error creating listing:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchListings();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Database Example</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      )}

      {/* Create Listing Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Listing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newListing.title}
                onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                placeholder="Enter listing title"
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={newListing.price}
                onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={newListing.category}
              onValueChange={(value) => setNewListing({ ...newListing, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={newListing.location}
              onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
              placeholder="Enter location"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newListing.description}
              onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
              placeholder="Enter listing description"
              rows={3}
            />
          </div>
          
          <Button onClick={createListing} disabled={loading}>
            {loading ? 'Creating...' : 'Create Listing'}
          </Button>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user._id} className="p-3 border rounded">
                <div className="font-medium">{user.firstName} {user.lastName}</div>
                <div className="text-sm text-gray-600">@{user.username}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Listings List */}
      <Card>
        <CardHeader>
          <CardTitle>Listings ({listings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {listings.map((listing) => (
              <div key={listing._id} className="p-4 border rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{listing.title}</h3>
                    <p className="text-sm text-gray-600">{listing.description}</p>
                    <p className="text-sm text-gray-600">
                      By {listing.sellerId.firstName} {listing.sellerId.lastName}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${listing.price}</div>
                    <div className="text-sm text-gray-600">{listing.category}</div>
                    <div className="text-sm text-gray-600">{listing.status}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

