const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authRequired = require('../middleware/authRequired');

// All cart routes require authentication
router.use(authRequired);

// GET /api/cart - Get user's cart with product details
router.get('/', async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate total
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    res.json({ 
      items: cartItems,
      total,
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    });
  } catch (err) {
    console.error('GET /api/cart error:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /api/cart - Add item to cart
router.post('/', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (!productId || !quantity) {
      return res.status(400).json({ error: 'productId and quantity are required' });
    }

    const numericQuantity = parseInt(quantity);
    if (Number.isNaN(numericQuantity) || numericQuantity < 1) {
      return res.status(400).json({ error: 'quantity must be a positive number' });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId: req.user.id,
        productId: parseInt(productId)
      }
    });

    let cartItem;
    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + numericQuantity;
      
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: { product: true }
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: req.user.id,
          productId: parseInt(productId),
          quantity: numericQuantity
        },
        include: { product: true }
      });
    }

    res.status(201).json({ cartItem });
  } catch (err) {
    console.error('POST /api/cart error:', err);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// PUT /api/cart/:itemId - Update cart item quantity
router.put('/:itemId', async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId);
    const { quantity } = req.body;

    if (Number.isNaN(itemId)) {
      return res.status(400).json({ error: 'Invalid item id' });
    }

    if (!quantity) {
      return res.status(400).json({ error: 'quantity is required' });
    }

    const numericQuantity = parseInt(quantity);
    if (Number.isNaN(numericQuantity) || numericQuantity < 1) {
      return res.status(400).json({ error: 'quantity must be a positive number' });
    }

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId: req.user.id
      },
      include: { product: true }
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: numericQuantity },
      include: { product: true }
    });

    res.json({ cartItem: updatedItem });
  } catch (err) {
    console.error('PUT /api/cart/:itemId error:', err);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

// DELETE /api/cart/:itemId - Remove item from cart
router.delete('/:itemId', async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId);

    if (Number.isNaN(itemId)) {
      return res.status(400).json({ error: 'Invalid item id' });
    }

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId: req.user.id
      }
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Delete the item
    await prisma.cartItem.delete({
      where: { id: itemId }
    });

    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('DELETE /api/cart/:itemId error:', err);
    res.status(500).json({ error: 'Failed to remove cart item' });
  }
});

// DELETE /api/cart - Clear entire cart
router.delete('/', async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId: req.user.id }
    });

    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error('DELETE /api/cart error:', err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = router;
