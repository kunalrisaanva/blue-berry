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

const allProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await db.query(`SELECT * FROM products`);
    if (products && products.rowCount !== null && products.rowCount > 0) {
      const response = new ApiResponse(
        200,
        products.rows,
        "Products fetched successfully"
      );
      return res.status(200).json(response);
    } else {
      return next(new ApiError(404, "No products found"));
    }
  }
);

const addProduct = asyncHandler(
  async (req: MulterRequest, res: Response, next: NextFunction) => {
    const {
      name,
      description,
      price,
      previousPrice,
      qty,
      category,
      inStock,
      rating,
      isNew,
    } = req.body;
    // console.log("req.body",req.body);

    const existingProduct = await db.query(
      "SELECT * FROM products WHERE name = $1",
      [name]
    );

    if (
      existingProduct &&
      existingProduct.rowCount &&
      existingProduct.rowCount > 0
    ) {
      return next(new ApiError(400, "Product already exists"));
    }

    //   Handle image upload
    let imageurl: string = "";

    if (req.file && req.file.path) {
      const userImagePath = req.file.path;
      console.log("userImagePath", userImagePath);
      imageurl = await cloudinaryUploader(userImagePath);
    }

    const newProduct = await db.query(
      `INSERT INTO products (name, description, price,previousPrice, imageurl, qty, category, inStock, rating, isNew) 
     VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9,$10) 
     RETURNING *`,
      [
        name,
        description,
        price,
        previousPrice,
        imageurl,
        qty,
        category,
        inStock,
        rating,
        isNew,
      ]
    );

    const response = new ApiResponse(
      201,
      newProduct.rows[0],
      "Product created successfully"
    );
    console.log("res", response);

    return res.status(201).json(response);
  }
);

const getSingleProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.query;

    console.log(id);

    const product = await db.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);

    const response = new ApiResponse(
      200,
      product.rows,
      "Product fetched successfully"
    );

    return res.status(200).json(response);
  }
);

export { allProducts, addProduct , getSingleProductById};
