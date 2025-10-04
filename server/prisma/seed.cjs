// Prisma seed script: seeds sample products
// Run via: npm run prisma:seed --prefix server

require('dotenv').config({ path: require('path').join(__dirname, '../server/.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: 'Classic White T-Shirt',
      description: '100% cotton crew neck t-shirt. Comfortable, breathable, and perfect for everyday wear.',
      price: 25,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop',
      category: 'T-Shirts'
    },
    {
      name: 'Slim Fit Jeans',
      description: 'Dark wash slim fit jeans with stretch denim for comfort. Classic 5-pocket design.',
      price: 80,
      imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=600&fit=crop',
      category: 'Jeans'
    },
    {
      name: 'Leather Jacket',
      description: 'Premium genuine leather jacket with quilted lining. Timeless style and durability.',
      price: 300,
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=600&fit=crop',
      category: 'Jackets'
    },
    {
      name: 'Summer Floral Dress',
      description: 'Lightweight floral print dress perfect for summer. Flowy fit with adjustable straps.',
      price: 60,
      imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=600&fit=crop',
      category: 'Dresses'
    },
    {
      name: 'Wool Blend Sweater',
      description: 'Cozy wool blend pullover sweater. Ribbed cuffs and hem for a perfect fit.',
      price: 70,
      imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=600&fit=crop',
      category: 'Sweaters'
    },
    {
      name: 'Athletic Joggers',
      description: 'Comfortable joggers with elastic waistband and zippered pockets. Perfect for workouts.',
      price: 45,
      imageUrl: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&h=600&fit=crop',
      category: 'Activewear'
    },
    {
      name: 'Button-Up Shirt',
      description: 'Classic oxford button-up shirt in light blue. Wrinkle-resistant fabric.',
      price: 50,
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=600&fit=crop',
      category: 'Shirts'
    },
    {
      name: 'Denim Shorts',
      description: 'Mid-rise denim shorts with distressed details. Perfect for casual summer days.',
      price: 40,
      imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&h=600&fit=crop',
      category: 'Shorts'
    },
    {
      name: 'Hoodie Sweatshirt',
      description: 'Soft fleece hoodie with kangaroo pocket and drawstring hood. Ultimate comfort.',
      price: 55,
      imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=600&fit=crop',
      category: 'Hoodies'
    },
    {
      name: 'Maxi Skirt',
      description: 'Flowing maxi skirt with elastic waistband. Elegant and versatile for any occasion.',
      price: 65,
      imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&h=600&fit=crop',
      category: 'Skirts'
    },
    {
      name: 'Blazer Jacket',
      description: 'Tailored blazer with notched lapels. Professional look for office or formal events.',
      price: 130,
      imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=600&fit=crop',
      category: 'Blazers'
    },
    {
      name: 'Cargo Pants',
      description: 'Utility cargo pants with multiple pockets. Durable and functional streetwear.',
      price: 75,
      imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=600&fit=crop',
      category: 'Pants'
    }
  ];

  // Idempotent seed without requiring a unique constraint on name
  for (const p of products) {
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.product.create({ data: p });
    } else {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          description: p.description,
          price: p.price,
          imageUrl: p.imageUrl,
          category: p.category
        }
      });
    }
  }

  const count = await prisma.product.count();
  console.log(`Seed complete. Products in DB: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
