const { responseHandler } = require("./response");
const stripe = require('stripe')(process.env.STRIPE_KEY);

exports.makePayment = async (req, res) => {
    const { amount, currency } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });
        responseHandler.success(res, paymentIntent, "Payment Successfully", 200)
    } catch (error) {
        responseHandler.error(res, error.message, 500)
    }
};