"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Upload, DollarSign, Package, FileText, Star, BookOpen, Ruler, Weight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from '@/components/ui/image-upload';
import { LocationDetector } from '@/components/ui/location-detector';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { toast } from 'sonner';
import { useUser, SignInButton } from '@clerk/nextjs';
import { useDatabase } from '@/hooks/use-database';
import { useRouter } from 'next/navigation';

const ThreeBackground = dynamic(() => import('@/components/background/three-background'), { 
  ssr: false 
});

export default function SellPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { post, loading, error } = useDatabase();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    condition: '',
    location: '',
    images: [] as string[],
    
    // Enhanced item details
    brand: '',
    model: '',
    year: '',
    edition: '',
    isbn: '',
    publisher: '',
    author: '',
    pages: '',
    language: '',
    
    // Dimensions
    length: '',
    width: '',
    height: '',
    dimensionUnit: 'cm',
    
    // Weight
    weight: '',
    weightUnit: 'kg',
    
    // Additional details
    warranty: '',
    returnPolicy: '',
    shippingInfo: '',
    
    // Contact info
    phone: '',
    email: '',
    preferredContact: 'email',
  });

  const categories = ['Books', 'Engineering Kits', 'Notes', 'Others'];
  const conditions = ['new', 'like-new', 'good', 'fair', 'poor'];
  const dimensionUnits = ['cm', 'inch', 'mm'];
  const weightUnits = ['kg', 'g', 'lb', 'oz'];
  const contactMethods = ['email', 'phone', 'both'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImagesUploaded = (imageUrls: string[]) => {
    console.log('Images uploaded:', imageUrls);
    setFormData(prev => ({
      ...prev,
      images: imageUrls
    }));
    toast.success(`Successfully uploaded ${imageUrls.length} images`);
  };

  const handleLocationDetected = (location: string) => {
    console.log('Location detected:', location);
    setFormData(prev => ({
      ...prev,
      location: location
    }));
    if (location) {
      toast.success(`Location set to: ${location}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      toast.error('Please sign in to list items');
      return;
    }

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.category || !formData.price || !formData.condition || !formData.location) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Create listing data
      const listingData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        condition: formData.condition,
        location: formData.location,
        images: formData.images,
        tags: [],
        status: 'active',
        
        // Enhanced item details
        brand: formData.brand || undefined,
        model: formData.model || undefined,
        year: formData.year ? parseInt(formData.year) : undefined,
        edition: formData.edition || undefined,
        isbn: formData.isbn || undefined,
        publisher: formData.publisher || undefined,
        author: formData.author || undefined,
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        language: formData.language || undefined,
        
        // Dimensions
        dimensions: (formData.length || formData.width || formData.height) ? {
          length: formData.length ? parseFloat(formData.length) : undefined,
          width: formData.width ? parseFloat(formData.width) : undefined,
          height: formData.height ? parseFloat(formData.height) : undefined,
          unit: formData.dimensionUnit,
        } : undefined,
        
        // Weight
        weight: formData.weight ? {
          value: parseFloat(formData.weight),
          unit: formData.weightUnit,
        } : undefined,
        
        // Additional details
        warranty: formData.warranty || undefined,
        returnPolicy: formData.returnPolicy || undefined,
        shippingInfo: formData.shippingInfo || undefined,
        
        // Contact info
        contactInfo: (formData.phone || formData.email) ? {
          phone: formData.phone || undefined,
          email: formData.email || undefined,
          preferredContact: formData.preferredContact,
        } : undefined,
      };

      console.log('📝 Creating enhanced listing:', listingData);

      // Save to database
      const result = await post('/api/listings', listingData);
      
      console.log('✅ Enhanced listing created:', result);
      
      toast.success('Item listed successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        price: '',
        condition: '',
        location: '',
        images: [],
        brand: '',
        model: '',
        year: '',
        edition: '',
        isbn: '',
        publisher: '',
        author: '',
        pages: '',
        language: '',
        length: '',
        width: '',
        height: '',
        dimensionUnit: 'cm',
        weight: '',
        weightUnit: 'kg',
        warranty: '',
        returnPolicy: '',
        shippingInfo: '',
        phone: '',
        email: '',
        preferredContact: 'email',
      });

      // Redirect to my listings page
      router.push('/my-listings');
      
    } catch (err: any) {
      console.error('❌ Error creating listing:', err);
      toast.error(err.message || 'Failed to create listing');
    }
  };

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
              <p className="text-muted-foreground">Loading...</p>
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
              <h1 className="text-2xl font-bold mb-4">Sign in to sell items</h1>
              <p className="text-muted-foreground mb-6">
                You need to be signed in to list items for sale on eduXchange.
              </p>
              <SignInButton mode="modal">
                <Button size="lg">Sign In to Continue</Button>
              </SignInButton>
            </motion.div>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Sell Your Item</h1>
            <p className="text-muted-foreground">
              List your books, kits, or notes for fellow students with detailed information
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="backdrop-blur-sm bg-background/80">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Item Details</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="basic">Basic Info</TabsTrigger>
                      <TabsTrigger value="details">Item Details</TabsTrigger>
                      <TabsTrigger value="specs">Specifications</TabsTrigger>
                      <TabsTrigger value="contact">Contact</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="space-y-6">
                      {/* Title */}
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          placeholder="e.g., Engineering Mathematics Textbook"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          required
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe the condition, edition, any included materials..."
                          rows={4}
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          required
                        />
                      </div>

                      {/* Category and Condition */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Category *</Label>
                          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(category => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Condition *</Label>
                          <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              {conditions.map(condition => (
                                <SelectItem key={condition} value={condition}>
                                  {condition.charAt(0).toUpperCase() + condition.slice(1).replace('-', ' ')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="space-y-2">
                        <LocationDetector
                          onLocationDetected={handleLocationDetected}
                          label="Location *"
                          placeholder="e.g., Mumbai, Maharashtra"
                          autoDetectOnMount={true}
                          initialValue={formData.location}
                        />
                      </div>

                      {/* Price */}
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (₹) *</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="price"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-10"
                            value={formData.price}
                            onChange={(e) => handleInputChange('price', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {/* Image Upload */}
                      <div className="space-y-2">
                        <Label>Images</Label>
                        <ImageUpload
                          onImagesUploaded={handleImagesUploaded}
                          maxImages={5}
                          className="mt-2"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="details" className="space-y-6">
                      {/* Brand and Model */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="brand">Brand</Label>
                          <Input
                            id="brand"
                            placeholder="e.g., Pearson, McGraw Hill"
                            value={formData.brand}
                            onChange={(e) => handleInputChange('brand', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="model">Model/Series</Label>
                          <Input
                            id="model"
                            placeholder="e.g., 12th Edition, Arduino Uno"
                            value={formData.model}
                            onChange={(e) => handleInputChange('model', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Year and Edition */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="year">Year</Label>
                          <Input
                            id="year"
                            type="number"
                            placeholder="e.g., 2023"
                            value={formData.year}
                            onChange={(e) => handleInputChange('year', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edition">Edition</Label>
                          <Input
                            id="edition"
                            placeholder="e.g., 5th Edition"
                            value={formData.edition}
                            onChange={(e) => handleInputChange('edition', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* ISBN and Publisher */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="isbn">ISBN</Label>
                          <Input
                            id="isbn"
                            placeholder="e.g., 978-0-123456-47-2"
                            value={formData.isbn}
                            onChange={(e) => handleInputChange('isbn', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="publisher">Publisher</Label>
                          <Input
                            id="publisher"
                            placeholder="e.g., Pearson Education"
                            value={formData.publisher}
                            onChange={(e) => handleInputChange('publisher', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Author and Pages */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="author">Author</Label>
                          <Input
                            id="author"
                            placeholder="e.g., John Smith"
                            value={formData.author}
                            onChange={(e) => handleInputChange('author', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pages">Pages</Label>
                          <Input
                            id="pages"
                            type="number"
                            placeholder="e.g., 450"
                            value={formData.pages}
                            onChange={(e) => handleInputChange('pages', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Language */}
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Input
                          id="language"
                          placeholder="e.g., English, Hindi"
                          value={formData.language}
                          onChange={(e) => handleInputChange('language', e.target.value)}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="specs" className="space-y-6">
                      {/* Dimensions */}
                      <div className="space-y-4">
                        <Label className="flex items-center gap-2">
                          <Ruler className="h-4 w-4" />
                          Dimensions
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="length">Length</Label>
                            <Input
                              id="length"
                              type="number"
                              step="0.1"
                              placeholder="0.0"
                              value={formData.length}
                              onChange={(e) => handleInputChange('length', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="width">Width</Label>
                            <Input
                              id="width"
                              type="number"
                              step="0.1"
                              placeholder="0.0"
                              value={formData.width}
                              onChange={(e) => handleInputChange('width', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="height">Height</Label>
                            <Input
                              id="height"
                              type="number"
                              step="0.1"
                              placeholder="0.0"
                              value={formData.height}
                              onChange={(e) => handleInputChange('height', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Unit</Label>
                            <Select value={formData.dimensionUnit} onValueChange={(value) => handleInputChange('dimensionUnit', value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {dimensionUnits.map(unit => (
                                  <SelectItem key={unit} value={unit}>
                                    {unit.toUpperCase()}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Weight */}
                      <div className="space-y-4">
                        <Label className="flex items-center gap-2">
                          <Weight className="h-4 w-4" />
                          Weight
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="weight">Weight</Label>
                            <Input
                              id="weight"
                              type="number"
                              step="0.1"
                              placeholder="0.0"
                              value={formData.weight}
                              onChange={(e) => handleInputChange('weight', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Unit</Label>
                            <Select value={formData.weightUnit} onValueChange={(value) => handleInputChange('weightUnit', value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {weightUnits.map(unit => (
                                  <SelectItem key={unit} value={unit}>
                                    {unit.toUpperCase()}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="warranty">Warranty</Label>
                          <Input
                            id="warranty"
                            placeholder="e.g., 1 year manufacturer warranty"
                            value={formData.warranty}
                            onChange={(e) => handleInputChange('warranty', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="returnPolicy">Return Policy</Label>
                          <Input
                            id="returnPolicy"
                            placeholder="e.g., 7 days return policy"
                            value={formData.returnPolicy}
                            onChange={(e) => handleInputChange('returnPolicy', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="shippingInfo">Shipping Information</Label>
                          <Input
                            id="shippingInfo"
                            placeholder="e.g., Free local pickup, shipping extra"
                            value={formData.shippingInfo}
                            onChange={(e) => handleInputChange('shippingInfo', e.target.value)}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="contact" className="space-y-6">
                      {/* Contact Information */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="e.g., +91 98765 43210"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="e.g., seller@example.com"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Preferred Contact Method</Label>
                          <Select value={formData.preferredContact} onValueChange={(value) => handleInputChange('preferredContact', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {contactMethods.map(method => (
                                <SelectItem key={method} value={method}>
                                  {method.charAt(0).toUpperCase() + method.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Publishing...' : 'List Item'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}