# Cloudinary & Email Notification Setup

This document explains the Cloudinary image upload functionality and email notification system that has been integrated into the marketplace application.

## Cloudinary Configuration

### Credentials
- **Cloud Name**: `duim31eyq`
- **API Key**: `715767834879593`
- **API Secret**: `ituySwvhzUl_6joF-bXTB413LIQ`
- **Environment Variable**: `CLOUDINARY_URL=cloudinary://715767834879593:ituySwvhzUl_6joF-bXTB413LIQ@duim31eyq`

### Features
- Image upload with automatic optimization
- Multiple image support (up to 5 images per item)
- Drag & drop interface
- Image preview with delete functionality
- Automatic resizing and format optimization

### API Endpoints
- `POST /api/upload` - Upload images to Cloudinary
- Images are stored in the `marketplace` folder on Cloudinary

## Email Notification System

### Features
- Automatic email notifications for item purchases
- Borrow notifications for donated items
- Professional HTML email templates
- Fallback to plain text emails

### Email Types

#### 1. Purchase Notifications
- **Seller Notification**: Informs seller when their item is sold
- **Buyer Confirmation**: Confirms purchase to buyer
- Includes item details, price, and contact information

#### 2. Borrow Notifications
- **Donor Notification**: Informs donor when their item is borrowed
- Includes borrower details and item information

### Email Configuration

#### Development (Ethereal Email)
- Uses Ethereal Email for testing
- Preview URLs are logged to console
- No real emails sent

#### Production Setup
To use real email in production, set these environment variables:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com
NODE_ENV=production
```

### Supported Email Services
- Gmail (recommended for testing)
- SendGrid
- AWS SES
- Any SMTP service

## Usage Examples

### Image Upload Component
```tsx
import { ImageUpload } from '@/components/ui/image-upload';

<ImageUpload
  onImagesUploaded={(imageUrls) => {
    console.log('Uploaded images:', imageUrls);
  }}
  maxImages={5}
/>
```

### Purchase Modal Component
```tsx
import { PurchaseModal } from '@/components/ui/purchase-modal';

<PurchaseModal
  listing={listingData}
  trigger={<Button>Buy Now</Button>}
/>
```

## API Integration

### Creating a Listing with Images
```javascript
// 1. Upload images first
const formData = new FormData();
formData.append('images', file);

const uploadResponse = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

const { images } = await uploadResponse.json();

// 2. Create listing with image URLs
const listingResponse = await fetch('/api/listings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Item',
    price: 100,
    images: images.map(img => img.url),
    // ... other fields
  }),
});
```

### Purchasing an Item
```javascript
const purchaseResponse = await fetch(`/api/listings/${listingId}/purchase`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    buyerName: 'John Doe',
    buyerEmail: 'john@example.com',
    buyerPhone: '+1234567890',
    message: 'I would like to purchase this item'
  }),
});
```

## Security Considerations

1. **Cloudinary Security**
   - API credentials are stored in environment variables
   - Images are served via HTTPS
   - Automatic image optimization reduces bandwidth

2. **Email Security**
   - Use app passwords for Gmail
   - Implement rate limiting for email sending
   - Validate email addresses before sending

3. **File Upload Security**
   - File type validation (images only)
   - File size limits (5MB per image)
   - Maximum number of images per upload

## Troubleshooting

### Common Issues

1. **Image Upload Fails**
   - Check Cloudinary credentials
   - Verify file size and type
   - Check network connectivity

2. **Emails Not Sending**
   - Check email credentials in production
   - Verify SMTP settings
   - Check email service quotas

3. **Purchase Notifications Missing**
   - Verify user email addresses in database
   - Check email service configuration
   - Review server logs for errors

### Development Testing

1. **Test Image Upload**
   ```bash
   curl -X POST http://localhost:3000/api/upload \
     -F "images=@test-image.jpg"
   ```

2. **Test Email Sending**
   - Check console for Ethereal Email preview URLs
   - Use real email credentials for production testing

## Environment Variables

Add these to your `.env.local` file:

```env
# Cloudinary (already configured)
CLOUDINARY_URL=cloudinary://715767834879593:ituySwvhzUl_6joF-bXTB413LIQ@duim31eyq

# Email (for production)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com
NODE_ENV=development
```

## Dependencies Added

- `cloudinary` - Image upload and management
- `nodemailer` - Email sending
- `@types/nodemailer` - TypeScript types
- `react-dropzone` - Drag & drop file upload

## Next Steps

1. Test image upload functionality
2. Configure production email service
3. Implement email templates customization
4. Add image compression options
5. Implement image deletion when items are removed
