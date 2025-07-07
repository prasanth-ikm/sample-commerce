const CartTable = require("../models/cart");
const ProductTable = require("../models/product");
const OrdersTable = require("../models/order");
const { getTokenUserDetails } = require("./common");
const { responseHandler } = require("./response");
const { UserTable } = require("../models/subModels");

exports.addToCart = async (req, res) => {
    try {
        const { _id = '' } = await getTokenUserDetails(req);
        let userCart = await CartTable.findOne({ user: _id, isActive: true });
        const user = await UserTable.findById(_id);
        let product = await ProductTable.findById(req.body.productId);
        if (userCart) {
            // If cart exists, update the existing cart
            let itemIndex = userCart.items.findIndex(item => item.productId.toString() === req.body.productId);
            if (itemIndex > -1) {
                // If item exists in cart, update the quantity and price
                userCart.items[itemIndex].qty += req.body.qty;
                userCart.items[itemIndex].price += product.price;
                userCart.items[itemIndex].originalPrice += product.originalPrice;
            } else {
                userCart.items.push({
                    productId: req.body.productId,
                    qty: req.body.qty,
                    size: req.body.size,
                    imageUrl: product.url,
                    price: product.price,
                    title: product.title,
                    originalPrice: product.originalPrice,
                    productCode: product.productCode
                });
            }
            userCart.totalQty += req.body.qty;
            userCart.totalCost += product.price;
            userCart.originalCost += product.originalPrice;
            userCart.discount = userCart.originalCost - userCart.totalCost;
            userCart.address = user.defaultAddress
            await userCart.save();
            responseHandler.success(res, userCart, "Product Added to cart Successfully", 200)
        } else {
            let newCart = new CartTable({
                user: _id,
                items: [{
                    productId: req.body.productId,
                    qty: req.body.qty,
                    size: req.body.size,
                    imageUrl: product.url,
                    price: product.price,
                    title: product.title,
                    originalPrice: product.originalPrice,
                    productCode: product.productCode
                }],
                totalQty: req.body.qty,
                totalCost: product.price,
                address: user.defaultAddress,
                originalCost: product.originalPrice,
                discount: product.originalPrice - product.price
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
        let userCart = await CartTable.findOne({ user: _id, isActive: true });
        if (userCart) {
            let itemIndex = userCart.items.findIndex(item => item._id.toString() === req.body.productId);
            if (itemIndex > -1) {
                userCart.items.splice(itemIndex, 1);
                userCart.totalQty = userCart.items.reduce((sum, item) => sum + item.qty, 0);
                userCart.totalCost = userCart.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
                userCart.originalCost = userCart.items.reduce((sum, item) => sum + (item.originalPrice * item.qty), 0);
                userCart.discount = userCart.originalCost - userCart.totalCost;
                if (userCart.items.length === 0) {
                    await CartTable.deleteOne({ user: _id });
                    return responseHandler.success(res, {}, "Cart is empty", 200);
                }
                await userCart.save();
                responseHandler.success(res, userCart, "Product removed from cart", 200)
            } else {
                responseHandler.error(res, "Product not found in cart", 500)
            }
        } else {
            responseHandler.error(res, "Cart not found for the user", 500)
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
            let data = await CartTable.findOne({ user: _id, isActive: true });
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
        const { _id = '' } = await getTokenUserDetails(req);
        const { body: { cartId, paymentId } = {} } = req
        if (_id && cartId) {
            let cart = await CartTable.findOne({ _id: cartId, isActive: true });
            if (!cart) {
                return responseHandler.error(res, "Cart not found", 404);
            }
            const address = await UserTable.findOne(
                { _id, "addresses._id": cart.address },
                { "addresses.$": 1 }
            );
            const {
                name = '', district = '', houseAddress = '', locality = '', phone = '', pincode = '', state = ''
            } = address.addresses[0] || {};
            let orderData = new OrdersTable({
                totalQty: cart.totalQty,
                totalCost: cart.totalCost,
                originalCost: cart.originalCost,
                discount: cart.discount,
                deliveryCharge: cart.deliveryCharge,
                items: cart.items,
                user: _id,
                paymentId: paymentId,
                address: [name, houseAddress, state, district, locality, pincode, phone].join(', '),
                paymentStatus: !!paymentId,
                deliveryStatus: 'INITIATED'
            });
            await orderData.save();
            responseHandler.success(res, orderData, "Order placed successfully", 200)
            await CartTable.findByIdAndUpdate(cartId, { isActive: true });
        } else responseHandler.unauthorized(res, "Login to place order", 200)
    } catch (err) {
        if (err) {
            responseHandler.error(res, err.message, 500)
        }
    }
}

exports.getOrder = async (req, res) => {
    try {
        const { _id = '' } = await getTokenUserDetails(req);
        if (_id) {
            let data = await OrdersTable.find({ user: _id });
            responseHandler.success(res, data, 'Fetched success', 200)
        } else responseHandler.unauthorized(res, "Login to view orders", 200)
    } catch (err) {
        if (err) {
            responseHandler.error(res, err.message, 500)
        }
    }
}