const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserTable } = require("../models/subModels");
const CartTable = require("../models/cart");
const { responseHandler } = require("./response");
const { getTokenUserDetails } = require('./common');

exports.addUser = async (req, res) => {
    try {
        if (req.body) {
            const user = await UserTable.findOne({ userMail: req.body.userMail })
            if (user) {
                responseHandler.error(res, "Email Already Exist", 400)
            } else {
                //TO: const newPassword = otpGenerator.generate(8, { alphabets: false, upperCase: false, specialChars: false });
                let data = new UserTable(req.body)
                // data.userPassword = newPassword
                data.created = new Date()
                // sendEmail(data)
                const salt = await bcrypt.genSalt(10);
                data.userPassword = await bcrypt.hash(data.userPassword, salt);
                await data.save();
                responseHandler.success(res, data, "User Created Successfully", 200)
            }
        }
    } catch (err) {
        if (err) {
            responseHandler.error(res, err.message, 500)
        }
    }
};

exports.loginUser = async (req, res) => {
    try {
        const user = await UserTable.findOne({ userMail: req.body.userMail })
        if (!user) {
            responseHandler.error(res, "User Not Found", 400)
        }
        else {
            const isValid = await bcrypt.compare(req.body.userPassword, user.userPassword);
            if (!isValid) {
                responseHandler.error(res, "Invalid Password", 400)
            }
            else {
                jwt.sign({ userMail: user.userMail, UserID: user._id, Name: user.userName, UserType: 'User' }, process.env.JWT_SECRET,
                    { expiresIn: '14d' }, (err, token) => {
                        if (err) {
                            responseHandler.unauthorized(res, "Token Generation Error")
                        } else {
                            responseHandler.success(res, token, "Login Success", 200)
                        }
                    })
            }
        }
    } catch (err) {
        if (err) {
            responseHandler.error(res, err.message, 500)
        }
    }
}

exports.passwordChange = async (req, res) => {
    if (req.params.id && req.params.id !== "undefined") {
        try {
            const salt = await bcrypt.genSalt(10);
            let data = await UserTable.findOne({ _id: req.params.id })
            const isValid = await bcrypt.compare(req.body.oldPassword, data.userPassword);
            if (!isValid) {
                responseHandler.error(res, "Old Password is Wrong", 400)
            } else {
                data.userPassword = await bcrypt.hash(req.body.newPassword, salt);
                await data.save()
                responseHandler.success(res, data, "Password Changed Success", 200)
            }
        } catch (err) {
            if (err) {
                responseHandler.error(res, err.message, 500)
            }
        }
    }
}

exports.updateUser = async (req, res) => {
    try {
        let data = await UserTable.updateMany({ _id: req.params.id }, {
            $set: {
                userName: req.body.userName,
                userMail: req.body.userMail,
                userPhone: req.body.userPhone,
                userDetails: req.body.userDetails
            }
        })
        responseHandler.success(res, data, "User Updated Successfully", 200)
    } catch (err) {
        if (err) {
            responseHandler.error(res, err.message, 500)
        }
    }
}

exports.listUser = async (req, res) => {
    try {
        let data = await UserTable.find().sort({ "created": -1 });
        responseHandler.success(res, data, 'Fetched success', 200)
    } catch (err) {
        if (err) {
            responseHandler.error(res, err.message, 500)
        }
    }
}

exports.getById = async (req, res) => {
    try {
        const user = await getTokenUserDetails(req);
        if (user?._id) {
            let data = await UserTable.findById(user?._id)
            delete data.userPassword
            responseHandler.success(res, data, 'Fetched success', 200)
        } else {
            responseHandler.unauthorized(res, 'Un-authorized User', 401)
        }
    } catch (err) {
        if (err) {
            responseHandler.error(res, err.message, 500)
        }
    }
}

exports.addUpdateAddress = async (req, res) => {
    try {
        const user = await getTokenUserDetails(req);
        let address = {}
        if (user?._id) {
            if (req.body.addressId) {
                address = await UserTable.findOneAndUpdate(
                    { _id: user._id, "addresses._id": req.body.addressId },
                    {
                        $set: {
                            "addresses.$.name": req.body.name,
                            "addresses.$.houseAddress": req.body.houseAddress,
                            "addresses.$.state": req.body.state,
                            "addresses.$.district": req.body.district,
                            "addresses.$.locality": req.body.locality,
                            "addresses.$.pincode": req.body.pincode,
                            "addresses.$.phone": req.body.phone
                        }
                    },
                    { new: true, runValidators: true }
                );
            } else {
                address = await UserTable.findByIdAndUpdate(
                    user._id,
                    { $push: { addresses: req.body } },
                    { new: true, runValidators: true }
                );
            }
            responseHandler.success(res, address, 'Address updated successfully', 200);
        } else {
            responseHandler.unauthorized(res, 'Un-authorized User', 401)
        }
    } catch (err) {
        if (err) {
            responseHandler.error(res, err.message, 500)
        }
    }
}

exports.deleteAddress = async (req, res) => {
    try {
        const user = await getTokenUserDetails(req);
        if (user?._id) {
            if (req.body.addressId) {
                const updatedUser = await UserTable.findByIdAndUpdate(
                    user._id,
                    { $pull: { addresses: { _id: req.body.addressId } } },
                    { new: true }
                );
                responseHandler.success(res, updatedUser, 'Address removed successfully', 200);
            }
        } else {
            responseHandler.unauthorized(res, 'Un-authorized User', 401)
        }
    } catch (err) {
        if (err) {
            responseHandler.error(res, err.message, 500)
        }
    }
}

exports.getAddressById = async (req, res) => {
    try {
        const user = await getTokenUserDetails(req);
        if (user?._id) {
            const address = await UserTable.findOne(
                { _id: user._id, "addresses._id": req.params.id },
                { "addresses.$": 1 }
            );
            if (address && address.addresses.length > 0) {
                responseHandler.success(res, address.addresses[0], 'Address fetched successfully', 200);
            } else {
                responseHandler.error(res, 'Address not found', 404);
            }
        } else {
            responseHandler.unauthorized(res, 'Un-authorized User', 401)
        }
    } catch (err) {
        if (err) {
            responseHandler.error(res, err.message, 500)
        }
    }
}

exports.myAddress = async (req, res) => {
    try {
        const user = await getTokenUserDetails(req);
        if (user?._id) {
            const userDoc = await UserTable.findById(user._id);
            responseHandler.success(res, userDoc.addresses, 'Address fetched successfully', 200);
        } else {
            responseHandler.unauthorized(res, 'Un-authorized User', 401)
        }
    } catch (err) {
        if (err) {
            responseHandler.error(res, err.message, 500)
        }
    }
}

exports.defaultAddress = async (req, res) => {
    try {
        const user = await getTokenUserDetails(req);
        if (user?._id) {
            const data = await UserTable.findByIdAndUpdate( user?._id, {
                defaultAddress: req.body.addressId
            })
            let userCart = await CartTable.findOne({ user: user?._id });
            if (userCart) {
                userCart.address=req.body.addressId
                await userCart.save()
            }
            responseHandler.success(res, data, 'Default Address added', 200);
        } else {
            responseHandler.unauthorized(res, 'Un-authorized User', 401)
        }
    } catch (err) {
        if (err) {
            responseHandler.error(res, err.message, 500)
        }
    }
}

exports.productWishlist = async (req, res) => {
    try {
        const user = await getTokenUserDetails(req);
        const { productId } = req.body;
        if (!user?._id || !productId) {
            return responseHandler.error(res, "User or Product ID missing", 400);
        }
        const userDoc = await UserTable.findById(user._id);
        if (!userDoc) {
            return responseHandler.unauthorized(res, "User not found", 404);
        }
        const index = userDoc.wishlist?.indexOf(productId) ?? -1;
        if (index > -1) {
            userDoc.wishlist.splice(index, 1);
        } else {
            userDoc.wishlist = userDoc.wishlist || [];
            userDoc.wishlist.push(productId);
        }
        await userDoc.save();
        responseHandler.success(res, userDoc, 'Wishlist updated', 200);
    } catch (err) {
        responseHandler.error(res, err.message, 500);
    }
};