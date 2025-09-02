# Database Setup Guide

This guide will help you set up MongoDB for your social media app.

## Prerequisites

1. Node.js and pnpm installed
2. MongoDB installed locally or MongoDB Atlas account

## Local MongoDB Setup

### Option 1: Local MongoDB Installation

1. Install MongoDB Community Edition:
   - **macOS**: `brew install mongodb-community`
   - **Windows**: Download from [MongoDB website](https://www.mongodb.com/try/download/community)
   - **Linux**: Follow [MongoDB installation guide](https://docs.mongodb.com/manual/installation/)

2. Start MongoDB service:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Windows
   net start MongoDB
   
   # Linux
   sudo systemctl start mongod
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string

## Environment Configuration

1. Create a `.env.local` file in your project root:
   ```bash
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/social-media-app
   
   # For MongoDB Atlas, use your connection string:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/social-media-app?retryWrites=true&w=majority
   
   # Clerk Configuration (already configured)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

## Database Models

The following models have been created:

- **User**: User profiles with Clerk integration
- **Listing**: Items for sale
- **Donation**: Donation transactions
- **Event**: Social events
- **Note**: User notes and posts
- **Cart**: Shopping cart functionality

## API Endpoints

### Users
- `GET /api/users` - Get users (with filters)
- `POST /api/users` - Create user
- `GET /api/users/[id]` - Get specific user
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Listings
- `GET /api/listings` - Get listings (with filters)
- `POST /api/listings` - Create listing

## Usage

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. The database will automatically connect when you make API calls.

## Database Operations

Use the `useDatabase` hook in your components:

```typescript
import { useDatabase } from '@/hooks/use-database';

function MyComponent() {
  const { get, post, loading, error } = useDatabase();

  const fetchUsers = async () => {
    try {
      const data = await get('/api/users');
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <button onClick={fetchUsers}>Fetch Users</button>
    </div>
  );
}
```

## Security

- All API routes are protected with Clerk authentication
- Users can only modify their own data
- Input validation is handled by Mongoose schemas
- Database indexes are created for optimal performance

## Troubleshooting

1. **Connection Error**: Make sure MongoDB is running and the connection string is correct
2. **Authentication Error**: Verify your Clerk configuration
3. **Schema Validation Error**: Check that your data matches the model schemas

## Production Deployment

For production, consider:
- Using MongoDB Atlas or another cloud provider
- Setting up proper environment variables
- Implementing rate limiting
- Adding database backups
- Monitoring database performance

