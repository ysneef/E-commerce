import Stripe from 'stripe';
import dotenv from 'dotenv';
import { productModel } from '../models/productModel.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51T7zRPKrjWAd3tTTLdC0h4nAJPvO7Qxak8zbare35mqtQDwGGNUuoJmZSQWKFqKDCSTZT02BgCxyV11r1ovgvuI900qyZeBVdn');

export const createCheckoutSession = async (req, res) => {
    try {
        const { items, shippingAddress } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart items cannot be empty.' });
        }

        const line_items = [];

        // Validate items and calculate accurate prices
        for (const item of items) {
            const product = await productModel.findById(item.productId);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product not found: ${item.productId}` });
            }

            // Calculate final price (price - discount)
            const activeDiscountPercent = product.discountPercent || 0;
            const finalPrice = product.price - (product.price * activeDiscountPercent / 100);

            line_items.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name || 'Shoe',
                        metadata: {
                            size: item.size || 'N/A'
                        }
                    },
                    unit_amount: Math.round(finalPrice * 100), // Stripe expects cents
                },
                quantity: item.quantity || 1,
            });
        }

        const encodedAddress = encodeURIComponent(shippingAddress);
        const frontendUrl = process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:3000'; 

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items,
            success_url: `${frontendUrl}/checkout-success?session_id={CHECKOUT_SESSION_ID}&shipping=${encodedAddress}`,
            cancel_url: `${frontendUrl}/cart`,
        });

        res.status(200).json({ success: true, url: session.url });

    } catch (error) {
        console.error('Stripe create checkout error:', error);
        res.status(500).json({ success: false, message: error.message, error: error.message });
    }
};

export const verifySession = async (req, res) => {
    try {
        const { session_id } = req.query;
        if (!session_id) {
            return res.status(400).json({ success: false, message: 'Session ID is required.' });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
            return res.status(200).json({ success: true, session });
        } else {
            return res.status(400).json({ success: false, message: 'Payment not successful.' });
        }
    } catch (error) {
        console.error('Stripe verify session error:', error);
        res.status(500).json({ success: false, message: 'Failed to verify session.', error: error.message });
    }
};
