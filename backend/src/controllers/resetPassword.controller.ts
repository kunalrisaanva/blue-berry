import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { db } from "../dbConnection/db";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";
import { sendResetEmail } from "../utils/sendEmail";

async function hashPassword(password: string): Promise<string> {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}


const otpExpireTime = 30 * 60 *1000 // in ms

export const requestPasswordReset = async (req:Request,res:Response,next:NextFunction)=>{
    const { email } = req.body;

    // do email validation here
    if (!email) {
        return next(new ApiError(400, "Email is required"));
    }

    try{
        // check if user with this email exist
        const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rowCount === 0) {
            return next(new ApiError(404, "Email not found"));
        }

        // create token
        const token = uuidv4();
        const expires = Date.now() + otpExpireTime;

        // store token in database
        await db.query(
            'INSERT INTO password_reset_tokens (token, email, expires) VALUES ($1, $2, $3)',
            [token, email, expires]
        );

        // send user email for reset password link
        await sendResetEmail(email, token);

        return next(new ApiResponse(200, "Sent Password Reset Email."));
    }catch(err){
        console.error('Error:', err);
        return next(new ApiError(500, "Internal server error"));
    }


}





export const resetPassword = async (req:Request,res:Response,next:NextFunction)=>{
    const { token, newPassword } = req.body;

    // do email validation here
    if (!token || !newPassword) {
        return next(new ApiError(400, "Token and new password are required"));
    }

    // validate new password for security requirements
    // TODO


    try{
        // get token from  database
        const tokenResult = await db.query('SELECT * FROM password_reset_tokens WHERE token = $1', [token]);
        if (tokenResult.rowCount === 0) {
            return next(new ApiError(400, "Invalid or expired token"));
        }

        const resetData = tokenResult.rows[0];
        if (resetData.expires < Date.now()) {
            // Delete the expired token
            await db.query('DELETE FROM password_reset_tokens WHERE token = $1', [token]);
            return next(new ApiError(400, "Token expired"));
        }

        // get email from resetToken data
        const { email } = resetData;

        const hashedPassword = hashPassword(newPassword);
        const updateUserResult = await db.query(
            'UPDATE users SET password = $1 WHERE email = $2',
            [hashedPassword, email]
        );

        if (updateUserResult.rowCount !== null && updateUserResult.rowCount > 0) {
            // Delete the token after successful reset
            await db.query('DELETE FROM password_reset_tokens WHERE token = $1', [token]);
            return next(new ApiResponse(200, "Password reset successfully'"));
        } else {
            return next(new ApiResponse(404, "Error Something Went wrong"));
        }

    }catch(err){
        console.error('Error:', err);
        return next(new ApiError(500, "Internal server error"));
    }

}



