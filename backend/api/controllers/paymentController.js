// backend/api/controllers/paymentController.js
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Tenant = require('../models/Tenant');

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    try {
        const options = {
            amount: 199 * 100, // Amount in paise (199 INR)
            currency: "INR",
            receipt: `receipt_order_${new Date().getTime()}`,
        };
        const order = await instance.orders.create(options);
        if (!order) return res.status(500).send("Error creating order");
        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const { tenantId } = req.user;

    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
        return res.status(400).json({ msg: 'Transaction not legit!' });
    }

    // Payment is verified, now upgrade the tenant plan
    await Tenant.findByIdAndUpdate(tenantId, { plan: 'pro' });

    res.json({
        msg: 'Payment successful! Your plan is now Pro.',
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
    });
};