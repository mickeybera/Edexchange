'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';

interface ImageUploadProps {
  onImagesUploaded: (imageUrls: string[]) => void;
  maxImages?: number;
  className?: string;
}

export function ImageUpload({ 
  onImagesUploaded, 
  maxImages = 5, 
  className = '' 
}: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = async (files: File[]) => {
    if (uploadedImages.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images.`);
      return;
    }

    setIsUploading(true);
    
    try {
      // Validate files before upload
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not a valid image file`);
        }
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} is too large (max 5MB)`);
        }
      }

      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      console.log('Uploading files:', files.map(f => `${f.name} (${f.size} bytes, ${f.type})`));

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();
      console.log('Upload response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || responseData.details || 'Failed to upload images');
      }

      if (!responseData.success || !responseData.images) {
        throw new Error('Invalid response from server');
      }
      
      const newImageUrls = responseData.images.map((img: any) => img.url);
      
      const updatedImages = [...uploadedImages, ...newImageUrls];
      setUploadedImages(updatedImages);
      onImagesUploaded(updatedImages);
      
      console.log('Upload successful:', newImageUrls);
    } catch (error) {
      console.error('Error uploading images:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to upload images: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    await uploadFiles(acceptedFiles);
  }, [uploadedImages, maxImages, onImagesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    noClick: true, // Disable click on dropzone since we have a separate button
  });

  const removeImage = (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    onImagesUploaded(updatedImages);
  };

  const handleButtonClick = () => {
    // Create a temporary file input for the button
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      if (files.length > 0) {
        uploadFiles(files);
      }
    };
    input.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card className={`p-6 border-2 border-dashed transition-colors ${
        isDragActive 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400'
      }`}>
        <div {...getRootProps()} className="text-center cursor-pointer">
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-blue-600">Drop the images here...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                Drag & drop images here, or use the button below
              </p>
              <p className="text-sm text-gray-500">
                Supports: JPG, PNG, GIF, WebP (max 5MB each)
              </p>
              <p className="text-sm text-gray-500">
                Maximum {maxImages} images
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Upload Progress */}
      {isUploading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Uploading images...</p>
        </div>
      )}

      {/* Image Previews */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`Uploaded image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {uploadedImages.length < maxImages && (
        <Button
          onClick={handleButtonClick}
          disabled={isUploading}
          className="w-full"
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Select Images'}
        </Button>
      )}
    </div>
  );
}
