import { Request, Response, NextFunction } from "express";
// import { UserModel, UserDocument } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import { db } from "../dbConnection/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

async function hashPassword(password: string): Promise<string> {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

function comparePassword(password: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(password, hashedPassword);
}

const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (
      [email, password, ].some(
        (field) => field === undefined || field === null || field === ""
      )
    ) {
      return next(new ApiError(400, "All fields are required"));
    }
    if (password.length < 6) {
      return next(
        new ApiError(400, "Password must be at least 6 characters long")
      );
    }


    const hashedPassword = await hashPassword(password);

    const existingUser = await db.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    // Check if user already exists
    if (existingUser.rowCount !== null && existingUser.rowCount > 0) {
      throw next(new ApiError(400, "User already exists"));
    }
    // Create new user
    const newUser = await db.query(
      `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *`,
      [email, hashedPassword]
    );

    if (newUser && newUser.rowCount !== null && newUser.rowCount > 0) {
      const user = newUser.rows[0];
      const response = new ApiResponse(201, user, "User created successfully");
      return res.status(201).json(response);
    } else {
      return next(new ApiError(500, "User creation failed"));
    }
  }
);

const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (
      [email, password].some(
        (field) => field === undefined || field === null || field === ""
      )
    ) {
      return next(new ApiError(400, "All fields are required"));
    }
    if (password.length < 6) {
      return next(
        new ApiError(400, "Password must be at least 6 characters long")
      );
    }
    // Check if user exists
    const user = await db.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    if (user.rowCount === 0) {
      return next(new ApiError(401, "Invalid email or password"));
    }
    const userData = user.rows[0];

    // Check if password is correct
    const isPasswordValid = comparePassword(password, userData.password);
    if (!isPasswordValid) {
      return next(new ApiError(401, "Invalid email or password"));
    }
    // Generate JWT token

    const token = jwt.sign(
      { id: userData.id, email: userData.email },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    const { password: hashedPassword, ...safeUserData } = userData;
    const response = new ApiResponse(
      200,
      { token, safeUserData },
      "Login successful"
    );
    return res.status(200).json(response);
  }
);

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

export { registerUser, loginUser };
