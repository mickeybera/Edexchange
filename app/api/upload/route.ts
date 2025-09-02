import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    // Handle authentication
    let userId: string | null = null;
    try {
      const authResult = await auth();
      userId = authResult.userId;
    } catch (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    // Parse form data
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (formError) {
      console.error('Form data error:', formError);
      return NextResponse.json(
        { error: 'Invalid form data' },
        { status: 400 }
      );
    }

    const files = formData.getAll('images') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    console.log(`Processing ${files.length} files for user ${userId}`);

    // Convert files to base64 strings for Cloudinary
    const imagePromises = files.map(async (file, index) => {
      try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${file.name} is not an image`);
        }
        
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large (max 5MB)`);
        }
        
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        
        // Determine the correct MIME type
        const mimeType = file.type || 'image/jpeg';
        
        console.log(`File ${index + 1}: ${file.name} (${file.size} bytes, ${mimeType}) converted to base64`);
        
        // Return with MIME type information
        return {
          base64,
          mimeType,
          fileName: file.name
        };
      } catch (error) {
        console.error(`Error processing file ${index + 1}:`, error);
        throw new Error(`Failed to process file ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    const processedFiles = await Promise.all(imagePromises);
    console.log(`Successfully converted ${processedFiles.length} files to base64`);
    
    // Upload images to Cloudinary with proper MIME types
    const uploadPromises = processedFiles.map(async (fileData, index) => {
      try {
        // Create data URL with correct MIME type
        const dataUrl = `data:${fileData.mimeType};base64,${fileData.base64}`;
        
        const uploadResult = await uploadImage(dataUrl, {
          folder: 'marketplace',
          transformation: {
            width: 800,
            height: 600,
            crop: 'limit',
            quality: 'auto',
          },
        });
        
        console.log(`Successfully uploaded ${fileData.fileName} to Cloudinary`);
        return uploadResult;
      } catch (error) {
        console.error(`Failed to upload ${fileData.fileName}:`, error);
        throw new Error(`Failed to upload ${fileData.fileName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
    
    const uploadResults = await Promise.all(uploadPromises);

    console.log(`Successfully uploaded ${uploadResults.length} images to Cloudinary`);

    // Return the uploaded image URLs
    const imageUrls = uploadResults.map(result => ({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    }));

    return NextResponse.json({
      success: true,
      images: imageUrls,
      message: `Successfully uploaded ${imageUrls.length} images`,
    });

  } catch (error: any) {
    console.error('Error uploading images:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to upload images';
    let statusCode = 500;
    
    if (error.message.includes('Authentication')) {
      errorMessage = 'Authentication failed';
      statusCode = 401;
    } else if (error.message.includes('Invalid form data')) {
      errorMessage = 'Invalid form data';
      statusCode = 400;
    } else if (error.message.includes('No images provided')) {
      errorMessage = 'No images provided';
      statusCode = 400;
    } else if (error.message.includes('Cloudinary')) {
      errorMessage = 'Image upload service error';
      statusCode = 503;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }
}
