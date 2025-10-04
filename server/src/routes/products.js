const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authRequired = require('../middleware/authRequired');

// GET /api/products
// Supports optional pagination and filters: ?page=1&pageSize=12&q=search&category=Category
router.get('/', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize) || 12, 1), 100);
    const skip = (page - 1) * pageSize;

    const where = {};
    if (req.query.q) {
      where.OR = [
        { name: { contains: req.query.q, mode: 'insensitive' } },
        { description: { contains: req.query.q, mode: 'insensitive' } }
      ];
    }
    if (req.query.category) {
      where.category = req.query.category;
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    });
  } catch (err) {
    console.error('GET /api/products error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /api/products (auth required)
router.post('/', authRequired, async (req, res) => {
  try {
    const { name, description, price, imageUrl, category } = req.body || {};
    if (!name || !description || price == null || !imageUrl || !category) {
      return res.status(400).json({ error: 'name, description, price, imageUrl, category are required' });
    }
    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ error: 'price must be a positive number' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: numericPrice,
        imageUrl,
        category,
        ownerId: req.user.id
      }
    });

    res.status(201).json({ product });
  } catch (err) {
    console.error('POST /api/products error:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid product id' });

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json({ product });
  } catch (err) {
    console.error('GET /api/products/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// DELETE /api/products/:id (auth required, owner only)
router.delete('/:id', authRequired, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid product id' });

    const product = await prisma.product.findUnique({ where: { id } });
    
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Check if user is the owner
    if (product.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own products' });
    }

    // Delete product and all related records in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete all cart items containing this product
      await tx.cartItem.deleteMany({
        where: { productId: id }
      });
      
      // Delete all order items containing this product
      await tx.orderItem.deleteMany({
        where: { productId: id }
      });
      
      // Delete the product
      await tx.product.delete({ where: { id } });
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/products/:id error:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
