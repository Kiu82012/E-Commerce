# E-commerce Showcase Project

## Project Overview
A full-stack e-commerce website showcasing my development skills. The platform allows users to browse products, manage shopping carts, post their own products, and complete orders with a visual tracking system.

**Built by:** Cheung Chun Kiu

## Tech Stack

### Frontend
- **Framework**: Next.js 13 (React 18)
- **Styling**: Bootstrap 5 + React-Bootstrap
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Data Fetching**: SWR (Stale-While-Revalidate)
- **UI Components**: Custom components with Bootstrap

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **API**: RESTful API design

### Database
- **Database**: MySQL 8.x (XAMPP)
- **ORM**: Prisma ORM
- **Migrations**: Prisma Migrate

### Payment Processing
- **Payment Method**: Cash on Delivery (No online payment integration)

## Features

### Public Features (No Login Required)
1. **Product Catalog**
   - Browse all products with images
   - View product details in modal popup
   - See product prices and descriptions

2. **User Authentication**
   - User registration with email and password
   - User login/logout
   - JWT-based session management

### Authenticated User Features
1. **Shopping Cart**
   - Add/remove items from cart
   - Update item quantities
   - Persistent cart (stored in database)
   - Real-time total calculation
   - Cart badge showing item count

2. **User Product Management**
   - Post your own products for sale
   - Upload product images via URL
   - Delete your posted products
   - View product ownership (shows "Posted by: You")

3. **Checkout Process**
   - Complete shipping information form
   - Order summary with itemized list
   - Cash on Delivery payment option
   - Order confirmation

4. **Order History & Tracking**
   - View all past orders
   - Order details with product images
   - Visual order tracking timeline:
     - Order Placed ✓
     - Processing ○
     - Shipped ○
     - Delivered ○
   - Order status badges (Pending, Processing, Shipped, Delivered)

## Project Structure
```
ecommerce-showcase/
├── client/                    # Next.js frontend
│   ├── src/
│   │   ├── components/       # Reusable components (Navbar)
│   │   ├── context/          # React Context (Auth, Cart)
│   │   ├── lib/              # Utilities and config
│   │   └── pages/            # Next.js pages
│   │       ├── auth/         # Login & Register
│   │       ├── orders/       # Order history & details
│   │       ├── cart.js       # Shopping cart
│   │       ├── checkout.js   # Checkout process
│   │       ├── index.js      # Home page (product listing)
│   │       └── post-product.js # Post new product
│   └── package.json
│
├── server/                    # Express backend
│   ├── src/
│   │   ├── middleware/       # Auth middleware
│   │   ├── routes/           # API routes
│   │   │   ├── auth.js       # Authentication endpoints
│   │   │   ├── cart.js       # Cart management
│   │   │   ├── orders.js     # Order management
│   │   │   └── products.js   # Product CRUD
│   │   └── index.js          # Express app entry
│   ├── .env                  # Environment variables
│   └── package.json
│
├── prisma/                    # Database
│   ├── schema.prisma         # Database schema
│   ├── seed.cjs              # Seed data script
│   └── migrations/           # Database migrations
│
├── .gitignore
├── README.md                 # Project documentation
├── PROJECT_PLAN.md           # This file
└── package.json              # Root package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or later)
- MySQL (via XAMPP)
- npm or yarn

### Backend Setup
1. Install dependencies: `npm install`
2. Configure database in `.env`
3. Run migrations: `npx prisma migrate dev`
4. Start server: `npm run dev`

### Frontend Setup
1. Install dependencies: `cd client && npm install`
2. Configure environment variables
3. Start development server: `npm run dev`

## API Endpoints

### Auth
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (auth required)
- `DELETE /api/products/:id` - Delete product (owner only, auth required)

### Cart
- `GET /api/cart` - Get user's cart (auth required)
- `POST /api/cart` - Add item to cart (auth required)
- `PATCH /api/cart/:id` - Update cart item quantity (auth required)
- `DELETE /api/cart/:id` - Remove item from cart (auth required)

### Orders
- `POST /api/orders` - Create new order from cart (auth required)
- `GET /api/orders` - Get user's orders (auth required)
- `GET /api/orders/:id` - Get order details (auth required)

## Database Schema

### Users
- id (PK)
- email (string, unique)
- password (hashed with bcryptjs)
- createdAt (datetime)
- updatedAt (datetime)
- Relations: cartItems[], orders[], postedProducts[]

### Products
- id (PK)
- name (string)
- description (text)
- price (decimal)
- imageUrl (string)
- category (string)
- ownerId (FK to Users, nullable) - User who posted the product
- createdAt (datetime)
- updatedAt (datetime)
- Relations: cartItems[], orderItems[], owner

### CartItems
- id (PK)
- userId (FK to Users)
- productId (FK to Products)
- quantity (integer)
- createdAt (datetime)
- updatedAt (datetime)
- Relations: user, product

### Orders
- id (PK)
- userId (FK to Users)
- total (decimal)
- status (string: pending, processing, shipped, delivered, cancelled)
- shippingAddress (text)
- paymentMethod (string)
- createdAt (datetime)
- updatedAt (datetime)
- Relations: user, items[]

### OrderItems
- id (PK)
- orderId (FK to Orders)
- productId (FK to Products)
- quantity (integer)
- price (decimal) - Price at time of order
- Relations: order, product

## Implementation Phases

### Phase 1: Setup & Basic Structure ✅ COMPLETED
- ✅ Initialize Next.js and Express projects
- ✅ Set up Prisma with MySQL
- ✅ Create basic folder structure
- ✅ Set up JWT authentication
- ✅ Create database schema and migrations

### Phase 2: Core Features ✅ COMPLETED
- ✅ Implement product listing with images
- ✅ Create product detail modal popup
- ✅ Implement shopping cart functionality (add/remove/update)
- ✅ Set up user authentication (register/login)
- ✅ Add user product posting feature
- ✅ Implement product deletion (owner only)
- ✅ Add cart badge with item count

### Phase 3: Checkout & Orders ✅ COMPLETED
- ✅ Implement checkout process with shipping form
- ✅ Cash on Delivery payment method
- ✅ Create order history page
- ✅ Add visual order tracking timeline
- ✅ Order status management (pending → processing → shipped → delivered)
- ✅ Order confirmation page

### Phase 4: Polish & Testing (OPTIONAL - Skipped for Portfolio)
- ⏭️ Add loading states
- ⏭️ Implement error handling
- ⏭️ Write tests
- ⏭️ Optimize performance
- ⏭️ Add responsive design

**Note:** Phase 4 is optional for this portfolio project. The current implementation demonstrates all core full-stack development skills.

## Future Enhancements
- Product reviews and ratings
- Wishlist functionality
- Coupon/discount system
- Admin dashboard
- Email notifications
- Social login (Google, Facebook)
- Advanced search with filters
- Product recommendations

## Deployment
- Frontend: Vercel
- Backend: Railway/Render
- Database: MySQL (PlanetScale or similar)
- Environment variables management
- CI/CD pipeline setup
