import { Request, Response, NextFunction } from "express";

// Extend Express Request interface to include user with id
declare global {
  namespace Express {
    interface User {
      id: string | number;
      [key: string]: any;
    }
    interface Request {
      user?: User;
    }
  }
}
// import { UserModel, UserDocument } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import { db } from "../dbConnection/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail";
import { hasMXRecord, isEmailFormatValid } from "../utils/emailValidate";
// import { sendEmail } from "../utils/sendEmail";
// import  { sendEmail } from "../utils/sendEmail";

function generateNumericOTP(length: number = 4): number {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return parseInt(otp, 10);
}

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

    // Check if email is valid
    if (!isEmailFormatValid(email)) {
      return next(new ApiError(400, "Invalid email format"));
    }

    // Check if email has MX records
    if (!(await hasMXRecord(email))) {
      return next(new ApiError(400, "Email domain is not valid"));
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

    // create otp
    const otp = generateNumericOTP();
    // send mail

    const response = await sendEmail(email, otp.toString(), "registration");
    console.log("Email response:", response);
    // Create new user
    const newUser = await db.query(
      `INSERT INTO users (email, password, otp) VALUES ($1, $2, $3) RETURNING *`,
      [email, hashedPassword, otp]
    );

    if (response.success === true) {
      if (newUser && newUser.rowCount !== null && newUser.rowCount > 0) {
        const user = newUser.rows[0];
        const response = new ApiResponse(
          201,
          user,
          "User created successfully"
        );
        return res.status(201).json(response);
      } else {
        return next(new ApiError(500, "User creation failed"));
      }
    } else {
      return next(new ApiError(500, "something went wrong while sending OTP."));
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
      { token, ...safeUserData },
      "Login successful"
    );
    return res.status(200).json(response);
  }
);

const verifyOtp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;
    if (
      [email, otp].some(
        (field) => field === undefined || field === null || field === ""
      )
    ) {
      return next(new ApiError(400, "Email and OTP are required"));
    }
    // Check if user exists
    const user = await db.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    if (user.rowCount === 0) {
      return next(new ApiError(404, "User not found"));
    }
    const userData = user.rows[0];
    // Check if OTP matches
    if (userData.otp !== otp) {
      return next(new ApiError(401, "Invalid OTP"));
    }

    // OTP is valid, proceed with user verification
    const response = new ApiResponse(
      200,
      userData,
      "OTP verified successfully"
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

const changeEmail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const userId = req.user?.id; // Assuming user ID is stored in req.user

    if (!email) {
      return next(new ApiError(400, "Email is required"));
    }

    // Check if the new email already exists
    const existingUser = await db.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    if (existingUser.rowCount !== null && existingUser.rowCount > 0) {
      return next(new ApiError(400, "Email already exists"));
    }

    // Update the user's email
    const updatedUser = await db.query(
      `UPDATE users SET email = $1 WHERE id = $2 RETURNING *`,
      [email, userId]
    );

    if (updatedUser.rowCount === 0) {
      return next(new ApiError(500, "Failed to update email"));
    }

    const response = new ApiResponse(
      200,
      updatedUser.rows[0],
      "Email updated successfully"
    );
    return res.status(200).json(response);
  }
);

const changePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id; // Assuming user ID is stored in req.user
    if (
      [currentPassword, newPassword].some(
        (field) => field === undefined || field === null || field === ""
      )
    ) {
      return next(
        new ApiError(400, "Current password and new password are required")
      );
    }
    if (newPassword.length < 6) {
      return next(
        new ApiError(400, "New password must be at least 6 characters long")
      );
    }
    // Check if user exists
    const user = await db.query(`SELECT * FROM users WHERE id = $1`, [userId]);
    if (user.rowCount === 0) {
      return next(new ApiError(404, "User not found"));
    }
    const userData = user.rows[0];
    // Check if current password is correct
    const isCurrentPasswordValid = comparePassword(
      currentPassword,
      userData.password
    );
    if (!isCurrentPasswordValid) {
      return next(new ApiError(401, "Current password is incorrect"));
    }
    // Hash the new password
    const hashedNewPassword = await hashPassword(newPassword);
    // Update the user's password
    const updatedUser = await db.query(
      `UPDATE users SET password = $1 WHERE id = $2 RETURNING *`,
      [hashedNewPassword, userId]
    );
    if (updatedUser.rowCount === 0) {
      return next(new ApiError(500, "Failed to update password"));
    }
    const response = new ApiResponse(
      200,
      updatedUser.rows[0],
      "Password updated successfully"
    );
    return res.status(200).json(response);
  }
);

export { registerUser, loginUser, verifyOtp, changeEmail, changePassword };
