import { Request, Response, NextFunction } from "express";
// import "../../types/express"; // Ensure the extended type is imported
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import { db } from "../dbConnection/db";
import { cloudinaryUploader } from "../utils/cloudinary";



interface MulterRequest extends Request {
    file?: Express.Multer.File & { path: string };
  }


const allProducts = asyncHandler(async (req:Request,res:Response,next:NextFunction) => {

    const products = await db.query(`SELECT * FROM products`);
    if (products && products.rowCount !== null && products.rowCount > 0) {
        const response = new ApiResponse(200, products.rows, "Products fetched successfully");
        return res.status(200).json(response);
    } else {
        return next(new ApiError(404, "No products found"));
    }
     

});

const addProduct = asyncHandler(async (req:MulterRequest,res:Response,next:NextFunction) => {

    const { name, description, price, qty, category, inStock, rating , isNew } = req.body;
    // console.log("req.body",req.body);

 const existingProduct = await db.query("SELECT * FROM products WHERE name = $1", [name]);

  if (existingProduct && existingProduct.rowCount && existingProduct.rowCount > 0) {
    return next(new ApiError(400, "Product already exists"));
  }

//   Handle image upload
  let product_image_url: string = "";

  if (req.file && req.file.path) {
    const userImagePath = req.file.path;
    product_image_url = await cloudinaryUploader(userImagePath);
  }

  const newProduct = await db.query(
    `INSERT INTO products (name, description, price, image_url, qty, category, inStock, rating, isNew) 
     VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9) 
     RETURNING *`,
    [name, description, price, product_image_url, qty, category, inStock, rating, isNew]
  );

  const response = new ApiResponse(201, newProduct.rows[0], "Product created successfully");
  console.log("res",response);

  return res.status(201).json(response);

});





export {allProducts,addProduct}