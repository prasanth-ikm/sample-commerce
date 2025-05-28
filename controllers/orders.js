const CartTable = require("../models/cart");
const OrdersTable = require("../models/order");
const { responseHandler } = require("./response");

exports.addToCart = async (req, res) => {
    try {
        const { _id = '' } = await getTokenUserDetails(req);
        let userCart = await CartTable.findOne({ user: _id });
        if (userCart) {
            // If cart exists, update the existing cart
            let itemIndex = userCart.items.findIndex(item => item.productId.toString() === req.body.productId);
            if (itemIndex > -1) {
                // If item exists in cart, update the quantity and price
                userCart.items[itemIndex].qty += req.body.qty;
                userCart.items[itemIndex].price += req.body.price;
            } else {
                userCart.items.push({
                    productId: req.body.productId,
                    qty: req.body.qty,
                    price: req.body.price,
                    title: req.body.title,
                    productCode: req.body.productCode
                });
            }
            userCart.totalQty += req.body.qty;
            userCart.totalCost += req.body.price;
            await userCart.save();
            responseHandler.success(res, userCart, "Product Added to cart Successfully", 200)
        } else {
            let newCart = new CartTable({
                user: userId,
                items: [{
                    productId: req.body.productId,
                    qty: req.body.qty,
                    price: req.body.price,
                    title: req.body.title,
                    productCode: req.body.productCode
                }],
                totalQty: req.body.qty,
                totalCost: req.body.price
            });
            await newCart.save();
            responseHandler.success(res, newCart, "Product Added to cart Successfully", 200)
        }
    } catch (err) {
        if (err) {
            responseHandler.error(res, err.message, 500)
        }
    }
};

exports.deleteInCart = async (req, res) => {
    try {
        const { _id = '' } = await getTokenUserDetails(req);
        let userCart = await CartTable.findOne({ user: _id });
        if (userCart) {
            let itemIndex = userCart.items.findIndex(item => item.productId.toString() === req.body.productId);
            if (itemIndex > -1) {
                userCart.totalQty -= userCart.items[itemIndex].qty;
                userCart.totalCost -= userCart.items[itemIndex].price;
                userCart.items.splice(itemIndex, 1);
                await userCart.save();
                responseHandler.success(res, userCart, "Product removed from cart Successfully", 200)
            } else {
                responseHandler.error(res, "Product not found in cart", 404)
            }
        } else {
            responseHandler.error(res, "Cart not found for the user", 404)
        }
    } catch (err) {
        if (err) {
            responseHandler.error(res, err.message, 500)
        }
    }
}

exports.getCart = async (req, res) => {
    try {
        const { _id = '' } = await getTokenUserDetails(req);
        if (_id) {
            let data = await CartTable.findOne({ user: _id });
            responseHandler.success(res, data, 'Fetched success', 200)
        } else responseHandler.error(res, 'User ID missing', 500)
    } catch (err) {
        if (err) {
            responseHandler.error(res, err.message, 500)
        }
    }
}

exports.buyNow = async (req, res) => {
    try {
        let orderData = new OrdersTable(req.body);
        await orderData.save();
        responseHandler.success(res, orderData, "Order placed successfully", 200)
    } catch (err) {
        if (err) {
            responseHandler.error(res, err.message, 500)
        }
    }
}