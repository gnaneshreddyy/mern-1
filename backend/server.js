import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import Product from "./models/product.model.js";
import Cart from "./models/cart.model.js";
import { connectDB } from "./config/db.js";
import cors from "cors";

connectDB();

const app = express();
const PORT=process.env.PORT||5000
app.use(express.json());

app.use(cors());
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

// GET single product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

// POST - Create new product
app.post('/api/products', async (req, res) => {
    const { name, price, image } = req.body;
    
    // Validation
    if (!name || !price || !image) {
        return res.status(400).json({
            success: false,
            message: 'Please provide name, price, and image'
        });
    }
    
    // Validate price is a valid number
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Price must be a valid positive number'
        });
    }
    
    try {
        const product = new Product({
            name,
            price: priceNum,
            image
        });
        
        await product.save();
        
        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
});

// PUT - Update product
app.put('/api/products/:id', async (req, res) => {
    const { name, price, image } = req.body;
    
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        // Update fields if provided
        if (name !== undefined) product.name = name;
        if (price !== undefined) product.price = price;
        if (image !== undefined) product.image = image;
        
        const updatedProduct = await product.save();
        
        res.status(200).json({
            success: true,
            data: updatedProduct
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

// DELETE - Delete product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        await Product.findByIdAndDelete(req.params.id);
        
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});



// ========== CART API ENDPOINTS ==========

// GET - Get all cart items with product details
app.get('/api/cart', async (req, res) => {
    try {
        const cartItems = await Cart.find({}).populate('productId');
        res.status(200).json({
            success: true,
            data: cartItems
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

// POST - Add product to cart
app.post('/api/cart', async (req, res) => {
    const { productId } = req.body;
    
    if (!productId) {
        return res.status(400).json({
            success: false,
            message: 'Please provide productId'
        });
    }
    
    try {
        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        // Check if item already in cart
        const existingItem = await Cart.findOne({ productId });
        
        if (existingItem) {
            // Increment quantity
            existingItem.quantity += 1;
            await existingItem.save();
            const updatedItem = await Cart.findById(existingItem._id).populate('productId');
            return res.status(200).json({
                success: true,
                data: updatedItem
            });
        } else {
            // Add new item
            const cartItem = new Cart({ productId });
            await cartItem.save();
            const newItem = await Cart.findById(cartItem._id).populate('productId');
            return res.status(201).json({
                success: true,
                data: newItem
            });
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
});

// DELETE - Remove item from cart
app.delete('/api/cart/:id', async (req, res) => {
    try {
        const cartItem = await Cart.findById(req.params.id);
        
        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }
        
        await Cart.findByIdAndDelete(req.params.id);
        
        res.status(200).json({
            success: true,
            message: 'Item removed from cart'
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

// DELETE - Clear entire cart
app.delete('/api/cart', async (req, res) => {
    try {
        await Cart.deleteMany({});
        res.status(200).json({
            success: true,
            message: 'Cart cleared'
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

app.listen(PORT, () => {
  console.log("server started at localhost:"+PORT);
});
