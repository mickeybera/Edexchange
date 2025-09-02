'use client';

import React, { useState } from 'react';
import { ImageUpload } from '@/components/ui/image-upload';
import { LocationDetector } from '@/components/ui/location-detector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TestComponentsPage() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [detectedLocation, setDetectedLocation] = useState('');

  const handleImagesUploaded = (imageUrls: string[]) => {
    console.log('Images uploaded:', imageUrls);
    setUploadedImages(imageUrls);
  };

  const handleLocationDetected = (location: string) => {
    console.log('Location detected:', location);
    setDetectedLocation(location);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">Component Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Upload Test */}
        <Card>
          <CardHeader>
            <CardTitle>Image Upload Test</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              onImagesUploaded={handleImagesUploaded}
              maxImages={5}
            />
            {uploadedImages.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800">Uploaded Images:</h3>
                <ul className="mt-2 space-y-1">
                  {uploadedImages.map((url, index) => (
                    <li key={index} className="text-sm text-green-700">
                      Image {index + 1}: {url.substring(0, 50)}...
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location Detection Test */}
        <Card>
          <CardHeader>
            <CardTitle>Location Detection Test</CardTitle>
          </CardHeader>
          <CardContent>
            <LocationDetector
              onLocationDetected={handleLocationDetected}
              label="Test Location"
              placeholder="Enter location or use auto-detect"
              autoDetectOnMount={false}
            />
            {detectedLocation && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800">Detected Location:</h3>
                <p className="mt-2 text-blue-700">{detectedLocation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Combined Test */}
      <Card>
        <CardHeader>
          <CardTitle>Combined Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Current State:</h3>
              <p>Images uploaded: {uploadedImages.length}</p>
              <p>Location: {detectedLocation || 'Not detected'}</p>
            </div>
            
            <div className="flex space-x-4">
              <Button
                onClick={() => {
                  setUploadedImages([]);
                  setDetectedLocation('');
                }}
                variant="outline"
              >
                Reset All
              </Button>
              
              <Button
                onClick={() => {
                  console.log('Current state:', {
                    images: uploadedImages,
                    location: detectedLocation
                  });
                }}
              >
                Log State
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
