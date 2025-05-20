import { Resend } from 'resend';
import dotenv from "dotenv";
dotenv.config({ path: ".env" });


// dont add / slash at end of url, requires to add token parameter in url
const resetPasswordPageUrl = process.env.RESET_PASSWORD_PAGE_URL || "http://localhost:3001/reset-password"

// resend.com credentials
const resendApiKey = process.env.RESEND_API_KEY
const resend = new Resend(resendApiKey)



export async function sendResetEmail(email: string, token: string): Promise<void> {

    const resetLink = `${resetPasswordPageUrl}?token=${token}`; 
    const subject = 'Password Reset Request'
    const html = `
            <p>You requested a password reset for your account.</p>
            <p>Please click on the following link to reset your password:</p>
            <p><a href="${resetLink}">${resetLink}</a></p>
            <p>This link will expire in 1 hour.</p>
            <p>If you did not request this, please ignore this email.</p>
        `
    const text = `You requested a password reset for your account. Please visit the following link to reset your password: ${resetLink} This link will expire in 1 hour. If you did not request this, please ignore this email.`
    
    
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: subject,
            html: html,
            text: text
        });

        if (error) {
            console.error('Error sending email with Resend:', error);
            throw new Error(`Failed to send password reset email: ${error.message}`);
        }

        console.log(`Password reset email sent to ${email}. Resend ID: ${data?.id}`);
    } catch (error) {
        console.error(`Error sending email to ${email}:`, error);
        throw new Error('Failed to send password reset email.');
    }

}