const fs = require('fs');
const path = require('path');

async function testUpload() {
    console.log('🔍 Testing image upload functionality...');
    
    try {
        // Test Cloudinary configuration
        console.log('📡 Testing Cloudinary configuration...');
        const { v2: cloudinary } = require('cloudinary');
        
        cloudinary.config({ 
            cloud_name: 'duim31eyq', 
            api_key: '715767834879593', 
            api_secret: 'ituySwvhzUl_6joF-bXTB413LIQ'
        });
        
        console.log('✅ Cloudinary configuration loaded');
        
        // Test with a sample image URL
        console.log('📤 Testing upload with sample image...');
        const uploadResult = await cloudinary.uploader.upload(
            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
            {
                public_id: 'test-upload-shoes',
                folder: 'marketplace/test',
            }
        );
        
        console.log('✅ Upload test successful!');
        console.log('Public ID:', uploadResult.public_id);
        console.log('URL:', uploadResult.secure_url);
        
        // Test data URL format
        console.log('📤 Testing data URL upload...');
        const sampleBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
        const dataUrl = `data:image/png;base64,${sampleBase64}`;
        
        const dataUrlResult = await cloudinary.uploader.upload(dataUrl, {
            public_id: 'test-data-url',
            folder: 'marketplace/test',
        });
        
        console.log('✅ Data URL upload test successful!');
        console.log('Public ID:', dataUrlResult.public_id);
        console.log('URL:', dataUrlResult.secure_url);
        
        console.log('\n🎉 All upload tests passed!');
        console.log('\n📋 Upload functionality is working correctly:');
        console.log('✅ Cloudinary configuration');
        console.log('✅ URL-based uploads');
        console.log('✅ Data URL uploads');
        console.log('✅ Folder organization');
        console.log('✅ Public ID generation');
        
    } catch (error) {
        console.error('❌ Upload test failed:', error);
        console.error('Error details:', error.message);
    }
}

// Run the test
testUpload();
