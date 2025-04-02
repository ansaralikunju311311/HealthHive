import { razorpay } from '../../server.js';
import STATUS_CODE from '../../StatusCode/StatusCode.js';
import crypto from 'crypto';

export  const handlePayment = async(req, res) => {
    const { amount } = req.body;
    try {
        const options = {
            amount: Number(amount * 100), 
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
            payment_capture: 1,
            notes: {
                description: "Consultation Payment"
            }
        };
        
        const order = await razorpay.orders.create(options);
        
        res.status(STATUS_CODE.OK).json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt
        });
    } catch (error) {
        console.error('Payment error:', error);
        res.status(STATUS_CODE.BAD_REQUEST).json({ 
            message: 'Error processing payment',
            error: error.message 
        });
    }
}
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest("hex");
        if (razorpay_signature === expectedSign) {
            return res.status(STATUS_CODE.OK).json({
                message: "Payment verified successfully",
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id
            });
        } else {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                message: "Invalid signature sent!"
            });
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error!",
            error: error.message
        });
    }
};