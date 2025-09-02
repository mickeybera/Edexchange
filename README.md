# eduXchange - Student Marketplace

A modern, full-stack student marketplace built with Next.js 15, TypeScript, and Tailwind CSS. Students can buy and sell books, engineering kits, notes, and other academic materials.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with dark/light theme support
- **Product Browsing**: Search, filter, and browse items by category
- **Shopping Cart**: Add items to cart with quantity management
- **User Authentication**: Login/signup functionality with Clerk
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Animated Background**: CSS-based animated background for visual appeal
- **Real-time Updates**: Live cart updates and notifications

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom styling
- **Authentication**: Clerk
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Context API
- **Notifications**: Sonner toast notifications

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "project 4"
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up Clerk Authentication**
   
   a. Create a Clerk account at [https://clerk.com](https://clerk.com)
   
   b. Create a new application in your Clerk dashboard
   
   c. Get your API keys from the Clerk dashboard
   
   d. Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   CLERK_SECRET_KEY=sk_test_your_secret_key_here
   ```
   
   e. Configure your Clerk application settings:
   - Set the sign-in and sign-up URLs
   - Configure email templates (optional)
   - Set up social providers (optional)

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication Setup

### Clerk Configuration

The application uses Clerk for authentication. Here's how to set it up:

1. **Sign up for Clerk**: Visit [https://clerk.com](https://clerk.com) and create an account

2. **Create an Application**: 
   - Go to your Clerk dashboard
   - Click "Add Application"
   - Choose "Next.js" as your framework
   - Give your application a name (e.g., "eduXchange")

3. **Get Your API Keys**:
   - In your application dashboard, go to "API Keys"
   - Copy the "Publishable Key" and "Secret Key"

4. **Environment Variables**:
   Create a `.env.local` file in your project root:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   CLERK_SECRET_KEY=sk_test_your_secret_key_here
   ```

5. **Configure URLs** (optional):
   ```env
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
   ```

### Protected Routes

The following routes require authentication:
- `/profile` - User profile and settings
- `/sell` - List items for sale
- `/my-listings` - Manage user's listings

Public routes:
- `/` - Home page
- `/browse` - Product browsing
- `/cart` - Shopping cart
- `/donations` - Donations page
- `/events` - Events page
- `/notes` - Notes page

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── browse/            # Product browsing page
│   ├── cart/              # Shopping cart page
│   ├── donate/            # Donation page
│   ├── donations/         # Donations listing page
│   ├── events/            # Events page
│   ├── my-listings/       # User's listings page
│   ├── notes/             # Notes page
│   ├── profile/           # User profile page
│   ├── sell/              # Sell items page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── auth/              # Authentication components
│   ├── background/        # Background components
│   ├── layout/            # Layout components (navbar, footer)
│   └── ui/                # UI components (buttons, cards, etc.)
├── contexts/              # React Context providers
│   └── cart-context.tsx   # Shopping cart context
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── middleware.ts          # Clerk authentication middleware
└── public/                # Static assets
```

## 🎨 Key Components

### Pages
- **Home Page** (`app/page.tsx`): Landing page with featured products
- **Browse Page** (`app/browse/page.tsx`): Product browsing with search and filters
- **Cart Page** (`app/cart/page.tsx`): Shopping cart with quantity management
- **Sell Page** (`app/sell/page.tsx`): Form to list new items (requires auth)
- **Profile Page** (`app/profile/page.tsx`): User profile and settings (requires auth)

### Components
- **Navbar** (`components/layout/navbar.tsx`): Navigation with Clerk auth integration
- **Footer** (`components/layout/footer.tsx`): Site footer with links
- **ThreeBackground** (`components/background/three-background.tsx`): Animated background

### Contexts
- **CartContext** (`contexts/cart-context.tsx`): Shopping cart state management

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Features in Detail

### Product Browsing
- Search products by title
- Filter by category (Books, Engineering Kits, Notes, Others)
- Sort by price, condition, and date
- Grid and list view modes
- Responsive product cards with hover effects

### Shopping Cart
- Add/remove items
- Update quantities
- Real-time total calculation
- Persistent cart state
- Checkout functionality (placeholder)

### User Interface
- Dark/light theme toggle
- Responsive design for all screen sizes
- Smooth animations and transitions
- Loading states and error handling
- Toast notifications for user feedback

### Authentication
- **Clerk Integration**: Professional authentication system
- **Modal-based**: Sign in/sign up in modals
- **Protected Routes**: Automatic route protection
- **User Management**: Profile, settings, and account management
- **Social Login**: Support for Google, GitHub, etc. (configurable)

## 🚀 Deployment

The application is ready for deployment on platforms like:
- Vercel (recommended for Next.js)
- Netlify
- Railway
- AWS Amplify

### Environment Variables for Production

Make sure to set these environment variables in your production environment:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
CLERK_SECRET_KEY=sk_live_your_production_secret
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the development team

---

**Built with ❤️ for students by students**
