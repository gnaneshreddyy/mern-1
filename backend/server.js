import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import Product from "./models/product.model.js";
import { connectDB } from "./config/db.js";
import mongoose from "mongoose";
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
    
    try {
        const product = new Product({
            name,
            price,
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
            message: 'Server Error'
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



app.listen(PORT, () => {
  console.log("server started at localhost:"+PORT);
});
