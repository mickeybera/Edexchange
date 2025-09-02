#!/bin/bash

echo "🚀 Setting up MongoDB for your social media app..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew is not installed. Please install Homebrew first:"
    echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
fi

echo "✅ Homebrew is installed"

# Check if MongoDB is already installed
if brew list mongodb-community &> /dev/null; then
    echo "✅ MongoDB is already installed"
else
    echo "📦 Installing MongoDB..."
    brew tap mongodb/brew
    brew install mongodb-community
    echo "✅ MongoDB installed successfully"
fi

# Check if MongoDB service is running
if brew services list | grep mongodb-community | grep started &> /dev/null; then
    echo "✅ MongoDB service is already running"
else
    echo "🔄 Starting MongoDB service..."
    brew services start mongodb-community
    echo "✅ MongoDB service started"
fi

# Create the database
echo "🗄️ Creating database..."
mongosh --eval "use social-media-app" --quiet

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/social-media-app

# Clerk Configuration (update with your actual keys)
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
# CLERK_SECRET_KEY=your_clerk_secret_key
EOF
    echo "✅ .env.local file created"
else
    echo "✅ .env.local file already exists"
fi

echo ""
echo "🎉 MongoDB setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your Clerk keys in .env.local"
echo "2. Run: pnpm dev"
echo "3. Visit: http://localhost:3000/database-test"
echo "4. Click 'Run All Tests' to verify everything works"
echo ""
echo "If you prefer to use MongoDB Atlas (cloud) instead:"
echo "1. Go to https://www.mongodb.com/atlas"
echo "2. Create a free account and cluster"
echo "3. Get your connection string"
echo "4. Update MONGODB_URI in .env.local"

