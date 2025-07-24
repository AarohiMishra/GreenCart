import cloudinary from "cloudinary";
import Product from "../models/Product.js";

//Add Product : /api/product/add
export const addProduct = async (req, res) => {
    try{
        // Fixed: Changed from req.body.product to req.body.productData
        let productData = JSON.parse(req.body.productData);

        const images = req.files

        let imageUrl = await Promise.all(
            images.map(async (image) => {
                // Fixed: Changed from 'item.path' to 'image.path'
                let result = await cloudinary.uploader.upload(image.path, {resource_type: "image"});
                return result.secure_url;
            }))

            await Product.create({
                ...productData,
                image: imageUrl
            })

            res.json({success: true, message: "Product added successfully!"});
    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}


//Get Product : /api/product/list
export const productList = async (req, res) => {
    try{
        const products = await Product.find({});
        res.json({success: true, products});
    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message}); 
    }
}


//Get Single Product : /api/product/id
export const productById = async (req, res) => {
    try{
        const { id } = req.body
        const product = await Product.findById(id);
        res.json({success: true, product}); 
    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}


//Change Product Stock : /api/product/stock
export const changeStock = async (req, res) => {
    try{
        const { id, inStock } = req.body;
        await Product.findByIdAndUpdate(id, { inStock });
        res.json({success: true, message: "Stock updated successfully!"});
    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}