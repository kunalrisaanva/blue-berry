import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import { db } from "../dbConnection/db";


const allProducts = asyncHandler(async (req:Request,res:Response,next:NextFunction) => {

    const products = await db.query(`SELECT * FROM products`);
    if (products && products.rowCount !== null && products.rowCount > 0) {
        const response = new ApiResponse(200, products.rows, "Products fetched successfully");
        return res.status(200).json(response);
    } else {
        return next(new ApiError(404, "No products found"));
    }
     

});

const addProduct = asyncHandler(async (req:Request,res:Response,next:NextFunction) => {


    const {name, description, price, image_url, qty, category, inStock} = req.body;


    const existingProduct = await db.query("SELECT * FROM products WHERE name = $1", [name]);   

    if (existingProduct && existingProduct.rowCount !== null && existingProduct.rowCount > 0) {
        return next(new ApiError(400, "Product already exists"));
    }

    const newProduct = await db.query(
        `INSERT INTO products (name, description, price, image_url, qty, category, inStock) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [name, description, price, image_url, qty, category, inStock]
    );

    const response = new ApiResponse(201, newProduct.rows[0], "Product created successfully");

    return res.status(201).json(response);
     

});





export {allProducts,addProduct}