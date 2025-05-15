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



});





export {allProducts,addProduct}