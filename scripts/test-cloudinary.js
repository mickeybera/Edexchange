const cloudinary = require('cloudinary').v2;

// Configuration
cloudinary.config({ 
    cloud_name: 'duim31eyq', 
    api_key: '715767834879593', 
    api_secret: 'ituySwvhzUl_6joF-bXTB413LIQ'
});

async function testCloudinary() {
    try {
        console.log('🔍 Testing Cloudinary configuration...');
        
        // Test upload with a sample image URL
        const uploadResult = await cloudinary.uploader.upload(
            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
            {
                public_id: 'test-shoes',
                folder: 'marketplace/test',
            }
        );
        
        console.log('✅ Upload successful!');
        console.log('Public ID:', uploadResult.public_id);
        console.log('URL:', uploadResult.secure_url);
        
        // Test URL generation
        const optimizeUrl = cloudinary.url(uploadResult.public_id, {
            fetch_format: 'auto',
            quality: 'auto',
            width: 300,
            height: 300,
            crop: 'fill',
        });
        
        console.log('✅ Optimized URL generated:');
        console.log(optimizeUrl);
        
        // Test thumbnail generation
        const thumbnailUrl = cloudinary.url(uploadResult.public_id, {
            width: 150,
            height: 150,
            crop: 'fill',
            gravity: 'auto',
            quality: 'auto',
            fetch_format: 'auto',
        });
        
        console.log('✅ Thumbnail URL generated:');
        console.log(thumbnailUrl);
        
        console.log('🎉 All Cloudinary tests passed!');
        
    } catch (error) {
        console.error('❌ Cloudinary test failed:', error);
    }
}

// Run the test
testCloudinary();
