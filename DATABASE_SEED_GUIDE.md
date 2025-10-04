# Database Seed Guide - Clothing Products

## Updated Seed Data

The database seed file has been updated with **12 clothing products** across various categories:

### Product Categories
1. **T-Shirts** - Classic White T-Shirt ($24.99)
2. **Jeans** - Slim Fit Jeans ($79.99)
3. **Jackets** - Leather Jacket ($299.99)
4. **Dresses** - Summer Floral Dress ($59.99)
5. **Sweaters** - Wool Blend Sweater ($69.99)
6. **Activewear** - Athletic Joggers ($44.99)
7. **Shirts** - Button-Up Shirt ($49.99)
8. **Shorts** - Denim Shorts ($39.99)
9. **Hoodies** - Hoodie Sweatshirt ($54.99)
10. **Skirts** - Maxi Skirt ($64.99)
11. **Blazers** - Blazer Jacket ($129.99)
12. **Pants** - Cargo Pants ($74.99)

### Product Images
All products use high-quality Unsplash images of actual clothing items.

## How to Seed the Database

### Option 1: From Root Directory
```powershell
cd c:\Users\user\CascadeProjects\windsurf-project\ecommerce-showcase
npm run prisma:seed -w server
```

### Option 2: From Server Directory
```powershell
cd c:\Users\user\CascadeProjects\windsurf-project\ecommerce-showcase\server
npm run prisma:seed
```

### Option 3: Direct Prisma Command
```powershell
cd c:\Users\user\CascadeProjects\windsurf-project\ecommerce-showcase
npx prisma db seed --schema ./prisma/schema.prisma
```

## What Happens When You Seed

The seed script is **idempotent**, meaning:
- If a product with the same name exists, it will be **updated** with new data
- If a product doesn't exist, it will be **created**
- You can run the seed command multiple times safely

## Clear Database (Optional)

If you want to start fresh and remove old products:

```powershell
cd c:\Users\user\CascadeProjects\windsurf-project\ecommerce-showcase
npx prisma migrate reset --schema ./prisma/schema.prisma
```

⚠️ **Warning**: This will delete ALL data including users, orders, and cart items!

## Verify the Seed

After seeding, you should see:
```
Seed complete. Products in DB: 12
```

Then start your backend and frontend to see the new clothing products!

## Product Details

All products include:
- ✅ Realistic clothing names
- ✅ Detailed descriptions
- ✅ Competitive pricing ($24.99 - $299.99)
- ✅ Varied stock levels (25 - 150 units)
- ✅ High-quality product images
- ✅ Diverse clothing categories
