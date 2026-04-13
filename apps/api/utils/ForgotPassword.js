import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import MyConstants from './MyConstants.js';
dotenv.config();

const ForgotPassword = async (email, token, otp) => {
    try {
        const EMAIL_USER = process.env.EMAIL_USER || MyConstants.EMAIL_USER;
        const EMAIL_PASS = process.env.EMAIL_PASS || MyConstants.EMAIL_PASS;

        if (!EMAIL_USER || !EMAIL_PASS) {
            throw new Error("Missing EMAIL_USER or EMAIL_PASS in environment variables");
        }

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS,
            },
        });

        const info = await transport.sendMail({
            from: `"ShoeStore" <${EMAIL_USER}>`,
            to: email,
            subject: '🔐 Password Reset - ShoeStore',
            html: `
                <div style="max-width: 500px; margin: auto; font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
                    <div style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0px 2px 10px rgba(0,0,0,0.1);">
                        
                        <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
                        
                        <p style="color: #555; font-size: 16px;">
                            Hello <strong>${email}</strong>,
                        </p>
                        
                        <p style="color: #555; font-size: 16px;">
                            We received a request to reset your password. Please use the OTP code below:
                        </p>

                        <div style="text-align: center; margin: 20px 0;">
                            <span style="display: inline-block; font-size: 22px; font-weight: bold; color: #d63384; background: #ffe8f0; padding: 10px 20px; border-radius: 5px;">
                                ${otp}
                            </span>
                        </div>

                        <p style="color: #555; font-size: 16px;">
                            Your verification token:
                        </p>

                        <div style="text-align: center; margin: 10px 0;">
                            <span style="display: inline-block; font-size: 14px; color: #333; background: #eee; padding: 8px 15px; border-radius: 5px; word-break: break-all;">
                                ${token}
                            </span>
                        </div>

                        <p style="color: #999; font-size: 14px; text-align: center;">
                            This code will expire in 15 minutes.
                        </p>

                        <p style="color: #999; font-size: 14px; text-align: center;">
                            If you did not request a password reset, please ignore this email.
                        </p>

                    </div>

                    <div style="text-align: center; font-size: 12px; color: #888; margin-top: 20px;">
                        <p>© 2026 ShoeStore. All rights reserved.</p>
                    </div>
                </div>
            `,
        });

        console.log('Sending email info:', info.messageId);
        return true;

    } catch (error) {
        console.log('Error sending email:', error);
        throw error;
    }
};

export default ForgotPassword;
