import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import MyConstants from './MyConstants.js';
dotenv.config();

export const sendWelcomeEmail = async (email, userName) => {
    try {
        const EMAIL_USER = process.env.EMAIL_USER || MyConstants.EMAIL_USER;
        const EMAIL_PASS = process.env.EMAIL_PASS || MyConstants.EMAIL_PASS;

        if (!EMAIL_USER || !EMAIL_PASS) {
            console.log('Missing EMAIL credentials, skipping welcome email');
            return false;
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
            subject: '🎉 Welcome to ShoeStore!',
            html: `
                <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
                    <div style="background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0px 2px 10px rgba(0,0,0,0.1);">

                        <div style="text-align: center; margin-bottom: 20px;">
                            <h1 style="color: #111; font-size: 28px; margin: 0;">👟 ShoeStore</h1>
                        </div>

                        <h2 style="color: #333; text-align: center;">Welcome to the family!</h2>

                        <p style="color: #555; font-size: 16px;">
                            Hello <strong>${userName || email}</strong>,
                        </p>

                        <p style="color: #555; font-size: 16px;">
                            Thank you for registering an account at <strong>ShoeStore</strong>! 🎉<br/>
                            Your account has been successfully created.
                        </p>

                        <div style="background: #f0f4ff; border-left: 4px solid #4f46e5; padding: 15px; border-radius: 4px; margin: 20px 0;">
                            <p style="margin: 0; color: #333; font-size: 15px;">
                                📧 <strong>Email:</strong> ${email}
                            </p>
                        </div>

                        <p style="color: #555; font-size: 15px;">
                            You can now:
                        </p>
                        <ul style="color: #555; font-size: 15px; line-height: 1.8;">
                            <li>🛍️ Browse our latest shoe collections</li>
                            <li>⚡ Enjoy exclusive Flash Sale deals</li>
                            <li>📦 Track your orders in real-time</li>
                            <li>💬 Chat with our AI assistant for recommendations</li>
                        </ul>

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL || 'https://shoe-store--ysnef.replit.app'}"
                               style="display: inline-block; background: #111; color: #fff; padding: 12px 30px; border-radius: 25px; text-decoration: none; font-size: 16px; font-weight: bold;">
                                🛒 Start Shopping Now
                            </a>
                        </div>

                        <p style="color: #999; font-size: 13px; text-align: center;">
                            If you did not create this account, please ignore this email.
                        </p>
                    </div>

                    <div style="text-align: center; font-size: 12px; color: #888; margin-top: 20px;">
                        <p>© 2026 ShoeStore. All rights reserved.</p>
                    </div>
                </div>
            `,
        });

        console.log('Welcome email sent:', info.messageId);
        return true;
    } catch (error) {
        console.log('Error sending welcome email:', error);
        return false;
    }
};
