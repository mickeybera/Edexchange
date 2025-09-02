import { v2 as cloudinary } from 'cloudinary';

// Configuration
cloudinary.config({ 
    cloud_name: 'duim31eyq', 
    api_key: '715767834879593', 
    api_secret: 'ituySwvhzUl_6joF-bXTB413LIQ'
});

export interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string;
    url: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
}

export interface CloudinaryUploadOptions {
    public_id?: string;
    folder?: string;
    transformation?: any;
    resource_type?: 'image' | 'video' | 'raw';
}

/**
 * Upload an image to Cloudinary
 */
export async function uploadImage(
    file: string | Buffer,
    options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> {
    try {
        // If it's a base64 string, convert it to data URL format
        let uploadData: any = file;
        if (typeof file === 'string' && !file.startsWith('data:')) {
            uploadData = `data:image/jpeg;base64,${file}`;
        }
        
        console.log('Uploading to Cloudinary with options:', {
            folder: options.folder,
            transformation: options.transformation
        });
        
        const uploadResult = await cloudinary.uploader.upload(uploadData, {
            resource_type: 'image',
            ...options,
        });
        
        console.log('Cloudinary upload successful:', {
            public_id: uploadResult.public_id,
            url: uploadResult.secure_url
        });
        
        return uploadResult as CloudinaryUploadResult;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to upload image to Cloudinary: ${error.message}`);
        }
        throw new Error('Failed to upload image to Cloudinary');
    }
}

/**
 * Upload multiple images to Cloudinary
 */
export async function uploadMultipleImages(
    files: (string | Buffer)[],
    options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult[]> {
    try {
        const uploadPromises = files.map((file, index) => 
            uploadImage(file, {
                ...options,
                public_id: options.public_id ? `${options.public_id}_${index}` : undefined,
            })
        );
        
        return await Promise.all(uploadPromises);
    } catch (error) {
        console.error('Error uploading multiple images to Cloudinary:', error);
        throw new Error('Failed to upload images to Cloudinary');
    }
}

/**
 * Generate optimized URL for an image
 */
export function getOptimizedUrl(
    publicId: string,
    options: {
        width?: number;
        height?: number;
        crop?: string;
        gravity?: string;
        quality?: string;
        format?: string;
    } = {}
): string {
    return cloudinary.url(publicId, {
        fetch_format: 'auto',
        quality: 'auto',
        ...options,
    });
}

/**
 * Generate thumbnail URL for an image
 */
export function getThumbnailUrl(
    publicId: string,
    width: number = 300,
    height: number = 300
): string {
    return cloudinary.url(publicId, {
        width,
        height,
        crop: 'fill',
        gravity: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
    });
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<void> {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw new Error('Failed to delete image from Cloudinary');
    }
}

export default cloudinary;
