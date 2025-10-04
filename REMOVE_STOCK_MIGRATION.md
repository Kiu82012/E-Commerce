# Remove Stock Field - Migration Guide

## What Changed

The `stock` field has been completely removed from the database schema.

---

## Files Updated

### 1. **Database Schema** (`prisma/schema.prisma`)
- ✅ Removed `stock Int` field from Product model

### 2. **Seed File** (`prisma/seed.cjs`)
- ✅ Removed `stock: 999999` from all products
- ✅ Removed `stock: p.stock` from update operation

---

## How to Apply the Migration

### Step 1: Generate and Apply Migration

Run this command to create a migration that drops the stock column:

```powershell
cd c:\Users\user\CascadeProjects\windsurf-project\ecommerce-showcase
npx prisma migrate dev --name remove_stock_field --schema ./prisma/schema.prisma
```

This will:
1. Create a new migration file
2. Drop the `stock` column from the `Product` table
3. Update the Prisma client

### Step 2: Regenerate Prisma Client

```powershell
npx prisma generate --schema ./prisma/schema.prisma
```

### Step 3: Seed the Database (Optional)

If you want to refresh the products:

```powershell
npm run prisma:seed -w server
```

---

## What the Migration Does

The migration will execute SQL similar to:

```sql
ALTER TABLE `Product` DROP COLUMN `stock`;
```

This permanently removes the stock column from your database.

---

## Before Running Migration

**⚠️ Important:** Make sure your backend server is stopped before running the migration to avoid connection issues.

---

## After Migration

### Product Model Structure

**Before:**
```javascript
{
  id: 1,
  name: "Classic White T-Shirt",
  description: "...",
  price: 24.99,
  stock: 999999,  // ❌ Removed
  imageUrl: "...",
  category: "T-Shirts"
}
```

**After:**
```javascript
{
  id: 1,
  name: "Classic White T-Shirt",
  description: "...",
  price: 24.99,
  imageUrl: "...",
  category: "T-Shirts"
}
```

---

## Verification

After migration, verify the schema:

```powershell
npx prisma studio --schema ./prisma/schema.prisma
```

Open Prisma Studio and check that the Product table no longer has a `stock` field.

---

## Summary

✅ **Schema updated** - stock field removed
✅ **Seed file updated** - no stock values
✅ **Backend code** - already updated (no stock validation)
✅ **Frontend code** - already updated (no stock display)

Just run the migration command and you're done! 🎉
