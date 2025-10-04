# 🛒 E-Commerce Showcase

> A full-stack e-commerce web application demonstrating modern web development skills

[![Next.js](https://img.shields.io/badge/Next.js-13-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-green?style=flat&logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-blue?style=flat&logo=mysql)](https://www.mysql.com/)

**Live Demo:** Available on request (local setup required) | **Portfolio:** [Cheung Chun Kiu](#)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Screenshots](#-screenshots)
- [Future Enhancements](#-future-enhancements)
- [Author](#-author)

---

## 🎯 Overview

This is a **full-stack e-commerce platform** built to showcase proficiency in modern web development technologies. The application includes user authentication, product management, shopping cart functionality, and a complete checkout/order system.

**Key Highlights:**
- 🔐 Secure JWT-based authentication
- 🛍️ Full CRUD operations for products
- 🛒 Real-time shopping cart management
- 📦 Order tracking with visual timeline
- 👤 User-specific product posting and management
- 💳 Cash on Delivery payment option

---

## ✨ Features

### User Features
- **Authentication**
  - User registration and login
  - JWT token-based session management
  - Protected routes and API endpoints

- **Product Browsing**
  - View all products with images and details
  - Click products for detailed view in modal
  - Real-time product availability

- **Shopping Cart**
  - Add/remove products
  - Update quantities
  - Persistent cart (stored in database)
  - Real-time total calculation

- **User Product Management**
  - Post your own products for sale
  - Upload product images via URL
  - Delete your posted products
  - Owner-only product management

- **Checkout & Orders**
  - Complete checkout process
  - Shipping information form
  - Order confirmation
  - Order history with status tracking
  - Visual order tracking timeline (Pending → Processing → Shipped → Delivered)

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 13
- **Library:** React 18
- **Styling:** Bootstrap 5 + React-Bootstrap
- **State Management:** React Context API
- **HTTP Client:** Fetch API
- **Form Handling:** React Hook Form
- **Data Fetching:** SWR (React Hooks for Data Fetching)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database ORM:** Prisma
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** Express middleware

### Database
- **Database:** MySQL 8.x
- **Schema Management:** Prisma Migrations
- **Seeding:** Custom seed scripts

### Development Tools
- **Package Manager:** npm
- **Dev Server:** Nodemon (backend), Next.js Dev (frontend)
- **Environment Variables:** dotenv

---

## 📁 Project Structure

```
ecommerce-showcase/
├── client/                    # Next.js Frontend
│   ├── src/
│   │   ├── components/       # Reusable components (Navbar, etc.)
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
├── server/                    # Express Backend
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
├── PROJECT_PLAN.md           # Development roadmap
└── README.md                 # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MySQL** 8.x (via XAMPP, Docker, or local installation)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ecommerce-showcase.git
   cd ecommerce-showcase
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Set up environment variables**
   
   Create `server/.env`:
   ```env
   DATABASE_URL="mysql://root@localhost:3306/ecommerce"
   JWT_SECRET="your-secret-key-here"
   PORT=4000
   ```

4. **Set up the database**
   ```bash
   # Run Prisma migrations
   cd server
   npx prisma migrate dev --name init

   # Generate Prisma Client
   npx prisma generate

   # Seed the database with sample products
   npm run prisma:seed
   ```

5. **Start the development servers**

   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm run dev
   # Server runs at http://localhost:4000
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd client
   npm run dev
   # App runs at http://localhost:3000
   ```

6. **Access the application**
   - Open your browser to `http://localhost:3000`
   - Register a new account or use seeded data

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |

### Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products | No |
| GET | `/api/products/:id` | Get product by ID | No |
| POST | `/api/products` | Create new product | Yes |
| DELETE | `/api/products/:id` | Delete product (owner only) | Yes |

### Cart Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/cart` | Get user's cart | Yes |
| POST | `/api/cart` | Add item to cart | Yes |
| PATCH | `/api/cart/:id` | Update cart item quantity | Yes |
| DELETE | `/api/cart/:id` | Remove item from cart | Yes |

### Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/orders` | Get user's orders | Yes |
| GET | `/api/orders/:id` | Get order details | Yes |
| POST | `/api/orders` | Create new order | Yes |

---

## 🗄️ Database Schema

### Users
- `id` (Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `createdAt`, `updatedAt`

### Products
- `id` (Primary Key)
- `name`, `description`, `price`
- `imageUrl`, `category`
- `ownerId` (Foreign Key → Users)
- `createdAt`, `updatedAt`

### CartItems
- `id` (Primary Key)
- `userId` (Foreign Key → Users)
- `productId` (Foreign Key → Products)
- `quantity`
- `createdAt`, `updatedAt`

### Orders
- `id` (Primary Key)
- `userId` (Foreign Key → Users)
- `total`, `status`
- `shippingAddress`, `paymentMethod`
- `createdAt`, `updatedAt`

### OrderItems
- `id` (Primary Key)
- `orderId` (Foreign Key → Orders)
- `productId` (Foreign Key → Products)
- `quantity`, `price`

---

## 📸 Screenshots

### Home Page - Product Listing
![Home Page](./screenshots/home.png)
*Browse all available products with images and prices*

### Product Detail Modal
![Product Detail](./screenshots/product-detail.png)
*View detailed product information and add to cart*

### Shopping Cart
![Shopping Cart](./screenshots/cart.png)
*Manage cart items with quantity updates and removal*

### Checkout Process
![Checkout](./screenshots/checkout.png)
*Complete shipping information and place order*

### Order Tracking
![Order Tracking](./screenshots/order-tracking.png)
*Visual timeline showing order status progression*

---





