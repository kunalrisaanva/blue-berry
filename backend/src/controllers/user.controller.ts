import { Request, Response, NextFunction } from "express";
// import { UserModel, UserDocument } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import { db } from "../dbConnection/db";
import bcrypt from "bcrypt";



async function hashPassword(password: string): Promise<string> {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}


function comparePassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
}



const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Validate Signup details
    const { email, password, username } = req.body;
    console.log("object ---->", req.body);

    if ([email, password, username].some(field => field === undefined || field === null || field === "")) {
        return next(new ApiError(400, "All fields are required"));
    }
    if (password.length < 6) {
        return next(new ApiError(400, "Password must be at least 6 characters long"));
    }
    if (username.length < 3) {
        return next(new ApiError(400, "Username must be at least 3 characters long"));
    }


    const hashedPassword = await hashPassword(password);

    console.log("hashedPassword ---->", hashedPassword);
  
    const existingUser = await db.query(`SELECT * FROM users WHERE email = $1 OR username = $2`, [email, username]);

    console.log("existingUser ---->", existingUser);

    // Check if user already exists
    if (existingUser) {
        return next(new ApiError(400, "User with this email or username already exists"));
    }
    // Create new user
    const newUser = await db.query(`INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING *`, [email, hashedPassword, username]);
    console.log("newUser ---->", newUser);
    if (newUser && newUser.rowCount !== null && newUser.rowCount > 0) {
        const user = newUser.rows[0];
        const response = new ApiResponse(201, user, "User created successfully");
        return res.status(201).json(response);
    } else {
        return next(new ApiError(500, "User creation failed"));
    }

 
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
