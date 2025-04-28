const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserTable } = require("../models/subModels");
const { responseHandler } = require("./response");

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
                jwt.sign({ userMail: user.userMail, UserID: user._id, Name: user.userName, UserType: 'User' }, 'secretkey',
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
    if (req.params.id && req.params.id !== "undefined") {
        try {
            let data = await UserTable.findById({ _id: req.params.id })
            // const filter = await convertion(data)
            res.json(data)
        } catch (err) {
            if (err) {
                responseHandler.error(res, err.message, 500)
            }
        }
    }
}