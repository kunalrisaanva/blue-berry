import { Request, Response, NextFunction } from "express";
import { UserModel, UserDocument } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import { db } from "../dbConnection/db";

const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Validate Signup details
    const { email, password, username } = req.body;

    if ([email, password, username].some(field => field === undefined || field === null || field === "")) {
        return next(new ApiError(400, "All fields are required"));
    }

    const existingUser = await db.query(`SELECT * FROM users WHERE email = $1 OR username = $2`, [email, username]);

    console.log("existingUser ---->", existingUser);

    if (existingUser && existingUser.rowCount !== null && existingUser.rowCount > 0) {
        return next(new ApiError(400, "User with this email or username already exists"));
    }

    // Create new user
    // const newUser = await db.query(`INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING *`, [email, password, username]);
   
    // hash password will see how to handle in postgres

    // postgress: validate email, password, username
});

const loginUser = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    // Validate Login details
    // postgress: validate email, password, username
});

  
// const getUser = (req: Request, res: Response, next: NextFunction) => {
//   // Validate get user details
//   // postgress: validate email, password, username
// };
// const updateUser = (req: Request, res: Response, next: NextFunction) => {
//   // Validate update user details
//   // postgress: validate email, password, username
// };
// const deleteUser = (req: Request, res: Response, next: NextFunction) => {
//   // Validate delete user details
//   // postgress: validate email, password, username
// };
// const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
//   // Validate get all users details
//   // postgress: validate email, password, username
// };
// const getUserById = (req: Request, res: Response, next: NextFunction) => {
//   // Validate get user by id details
//   // postgress: validate email, password, username
// };

export { registerUser , loginUser};
