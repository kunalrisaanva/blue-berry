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

function generateNumericOTP(length: number = 4): string {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
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
  //   const { email, password } = req.body;

  //   if (
  //     [email, password].some(
  //       (field) => field === undefined || field === null || field === ""
  //     )
  //   ) {
  //     return next(new ApiError(400, "All fields are required"));
  //   }
  //   if (password.length < 6) {
  //     return next(
  //       new ApiError(400, "Password must be at least 6 characters long")
  //     );
  //   }

  //   // Check if email is valid
  //   if (!isEmailFormatValid(email)) {
  //     return next(new ApiError(400, "Invalid email format"));
  //   }

  //   // Check if email has MX records
  //   if (!(await hasMXRecord(email))) {
  //     return next(new ApiError(400, "Email domain is not valid"));
  //   }

  //   const existingUser = await db.query(
  //     `SELECT * FROM users WHERE email = $1`,
  //     [email]
  //   );

  //   // Check if user already exists
  //   if (existingUser.rowCount !== null && existingUser.rowCount > 0) {
  //     throw next(new ApiError(400, "User already exists"));
  //   }

  //   // create otp

    
  //   const otp = generateNumericOTP();

  //   const newUser = await db.query(
  //     `INSERT INTO users (otp) VALUES ($1) RETURNING *`,
  //     [otp]
  //   );

  //   // send mail
  //   const response = await sendEmail(email, otp.toString(), "registration");
  //   // console.log("Email response:", response);

  //   if (newUser && newUser.rowCount !== null && newUser.rowCount > 0) {
  //     if (response.success === true) {
  //       // const user = newUser.rows[0];
  //       const response = new ApiResponse(
  //         201,
  //         {},
  //         "OTP Sent successfully"
  //       );
  //       return res.status(201).json(response);
  //     } else {
  //       return next(
  //         new ApiError(500, "something went wrong while sending OTP.")
  //       );
  //     }
  //   } else {
  //     return next(new ApiError(500, "User creation failed"));
  //   }


  const { email } = req.body;

    if (!email) return next(new ApiError(400, "Email is required"));
    if (!isEmailFormatValid(email)) return next(new ApiError(400, "Invalid email format"));
    if (!(await hasMXRecord(email))) return next(new ApiError(400, "Invalid email domain"));

    const existing = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);

    const otp = generateNumericOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    if (existing.rowCount !== null && existing.rowCount > 0) {
      const user = existing.rows[0];

      if (user.is_verified) {
        return next(new ApiError(400, "User already registered"));
      }

      // Update OTP & reset attempts
      await db.query(
        `UPDATE users SET otp = $1, otp_expires_at = $2, otp_attempts = 0 WHERE email = $3`,
        [otp, otpExpiry, email]
      );
    } else {
      await db.query(
        `INSERT INTO users (email, otp, otp_expires_at, otp_attempts) VALUES ($1, $2, $3, 0)`,
        [email, otp, otpExpiry]
      );
    }

    const response = await sendEmail(email, otp, "registration");

    if (!response.success) {
      return next(new ApiError(500, "Failed to send OTP"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "OTP sent to your email"));
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

    if (!user)
      return next(new ApiError(500, "Failed to fetch user from database"));

    if (user.rowCount === 0) {
      return next(new ApiError(404, "User does not exist"));
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

     const { email, password, otp } = req.body;

    if ([email, password, otp].some(field => !field || field.trim() === "")) {
      return next(new ApiError(400, "Email, password and OTP are required"));
    }

    const result = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);

    if (result.rowCount === 0) {
      return next(new ApiError(404, "User not found"));
    }

    const user = result.rows[0];

    if (user.is_verified) {
      return next(new ApiError(400, "User is already verified"));
    }

    // Check OTP expiry
    if (!user.otp_expires_at || new Date(user.otp_expires_at) < new Date()) {
      return next(new ApiError(401, "OTP has expired. Please request a new one."));
    }

    // Check attempts
    if (user.otp_attempts >= 5) {
      return next(new ApiError(429, "Too many invalid attempts. Please request a new OTP."));
    }

    // Check OTP match
    if (user.otp !== otp) {
      await db.query(
        `UPDATE users SET otp_attempts = otp_attempts + 1 WHERE email = $1`,
        [email]
      );
      return next(new ApiError(401, "Invalid OTP"));
    }

    // OTP is valid → proceed
    const hashed = await hashPassword(password);
    await db.query(
      `UPDATE users SET password = $1, is_verified = TRUE, otp = NULL, otp_expires_at = NULL, otp_attempts = 0 WHERE email = $2`,
      [hashed, email]
    );

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User registered successfully"));


    // const { email, password, otp } = req.body;
    // if (
    //   [email, password, otp].some(
    //     (field) => field === undefined || field === null || field === ""
    //   )
    // ) {
    //   return next(new ApiError(400, "Email, password, and OTP are required"));
    // }
    // // Check if user exists
    // const user = await db.query(`SELECT * FROM users WHERE email = $1`, [
    //   email,
    // ]);
    // if (user.rowCount === 0) {
    //   return next(new ApiError(404, "User not found"));
    // }

    // // hash password
    // const hashedPassword = await hashPassword(password);
    // const userData = user.rows[0];
    // // Check if OTP matches
    // if (userData.otp !== otp) {
    //   return next(new ApiError(401, "Invalid OTP"));
    // }

    // const newUser = await db.query(
    //   `INSERT INTO users (email, password, otp) VALUES ($1, $2, $3) RETURNING *`,
    //   [email, hashedPassword, otp]
    // );

    // // OTP is valid, proceed with user verification
    // const response = new ApiResponse(
    //   200,
    //   userData,
    //   "OTP verified successfully"
    // );
    // return res.status(200).json(response);
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

const resetPasswordMail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      return next(new ApiError(400, "Email and new password are required"));
    }

    // Check if user exists
    const user = await db.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    if (user.rowCount === 0) {
      return next(new ApiError(404, "User not found"));
    }
    const userData = user.rows[0];

    // token genrating jwt
    const token = jwt.sign(
      { id: userData.id, email: userData.email },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    // send mail using nodemailer
    const emailResponse = await sendEmail(email, token, "reset");

    if (!emailResponse) {
      return next(new ApiError(500, "Failed to send password reset email"));
    }

    const response = new ApiResponse(
      200,
      // updatedUser.rows[0],
      "Password reset mail sent successfully. Please check your email."
    );
    return res.status(200).json(response);
  }
);

const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { newPassword } = req.body;
    const token = req.query.token || req.body.token || req.cookies.token;

    if (!token || typeof token !== "string" || !newPassword) {
      return next(new ApiError(400, "Token and new password are required"));
    }

    // Validate new password for security requirements
    if (newPassword.length < 6) {
      return next(
        new ApiError(400, "New password must be at least 6 characters long")
      );
    }

    // Verify the token
    let decodedToken;
    try {
      decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET || "your_jwt_secret"
      );
    } catch (error) {
      return next(new ApiError(400, "Invalid or expired token"));
    }

    let userId;
    if (
      typeof decodedToken === "object" &&
      decodedToken !== null &&
      "id" in decodedToken
    ) {
      userId = (decodedToken as jwt.JwtPayload).id;
    } else {
      return next(new ApiError(400, "Invalid token payload"));
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
      "Password reset successfully"
    );
    return res.status(200).json(response);
  }
);

export {
  registerUser,
  loginUser,
  verifyOtp,
  changeEmail,
  changePassword,
  resetPasswordMail,
  resetPassword,
};
