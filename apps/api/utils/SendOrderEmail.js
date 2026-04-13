import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendOrderEmail = async (email, userName, type, orderData) => {
    try {
        const EMAIL_USER = process.env.EMAIL_USER;
        const EMAIL_PASS = process.env.EMAIL_PASS;

        if (!EMAIL_USER || !EMAIL_PASS) {
            console.log("Missing EMAIL_USER or EMAIL_PASS in environment variables, skipping email send");
            return false;
        }

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS,
            },
        });

        let subject = '';
        let htmlContent = '';

        if (type === 'CREATED') {
            subject = '🎉 Order Confirmation - ShoeStore';
            htmlContent = `
                <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
                    <div style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0px 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; text-align: center;">Order Confirmation</h2>
                        <p style="color: #555; font-size: 16px;">Hello <strong>${userName}</strong>,</p>
                        <p style="color: #555; font-size: 16px;">Thank you for your purchase! We've received your order and are getting it ready.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                        <h4 style="color: #333;">Order Details:</h4>
                        <p style="color: #555;"><strong>Order ID:</strong> ${orderData._id}</p>
                        <p style="color: #555;"><strong>Order Date:</strong> ${new Date(orderData.createdAt || Date.now()).toLocaleString()}</p>
                        <p style="color: #555;"><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
                        <p style="color: #555;"><strong>Shipping Address:</strong><br />${orderData.shippingAddress}</p>
                        <p style="color: #555;"><strong>Total Price:</strong> <span style="color: #28a745; font-weight: bold;">${orderData.totalPrice} USD</span></p>
                        <br />
                        <p style="color: #555; font-size: 16px;">We will notify you once your order has been updated.</p>
                    </div>
                </div>
            `;
        } else if (type === 'STATUS_UPDATED') {
            subject = '📦 Order Status Update - ShoeStore';
            htmlContent = `
                <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
                    <div style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0px 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; text-align: center;">Order Status Update</h2>
                        <p style="color: #555; font-size: 16px;">Hello <strong>${userName}</strong>,</p>
                        <p style="color: #555; font-size: 16px;">Your order <strong>#${orderData._id?.slice(-6).toUpperCase() || orderData._id}</strong> has been updated to a new status:</p>
                        <div style="text-align: center; margin: 20px 0;">
                            <span style="display: inline-block; font-size: 20px; font-weight: bold; color: #fff; background: #007bff; padding: 10px 20px; border-radius: 5px; text-transform: uppercase;">
                                ${orderData.status}
                            </span>
                        </div>
                        <p style="color: #555; font-size: 16px;">If you have any questions, feel free to contact our support team.</p>
                    </div>
                </div>
            `;
        }

        const info = await transport.sendMail({
            from: `"ShoeStore" <${EMAIL_USER}>`,
            to: email,
            subject: subject,
            html: htmlContent,
        });

        console.log('Sending order email info:', info.messageId);
        return true;
    } catch (error) {
        console.log('Error sending order email:', error);
        return false;
    }
};
