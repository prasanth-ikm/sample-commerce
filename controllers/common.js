const nodemailer = require("nodemailer");
const path = require('path')
const jwt = require('jsonwebtoken');
const { UserTable } = require("../models/subModels");
const { responseHandler } = require("./response");

const sendEmail = async (data) => {
    let transporter = nodemailer.createTransport({
        host: "mail.ibafss.com",
        port: 465,
        secure: true, auth: { user: process.env.email, pass: process.env.password }
    });
    let mailOptions = { from: process.env.email, to: data.Email, subject: 'Login Credentials', text: 'Hello ' + data.Name + ',\n\n' + 'Username:  ' + data.Email + ',\n\n' + 'Password:  ' + data.Password + '\n\nThank You!\n' + '\n\nRegards Ocean Softwares\n' };

    transporter.sendMail(mailOptions, function (err) {
        if (err) {
            console.log({ error: "true" })
        } else {
            console.log({ error: "false" })
        }
    });
}

const saveFile = async (data, name) => {
    if (data) {
        data.mv(path.join(__dirname + `../../public/products/${name}`), function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('File Saved!');
            }
        });
    }
}
const deleteFile = async (data) => {
    if (data) {
        let fs = require('fs')
        fs.unlink(path.join(__dirname + `../../public/products/${data}`), function (err) {
            if (err) {
                console.log('Delete error');
            } else {
                console.log('File Deleted!');
            }
        });
    }
}


const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return responseHandler.forbidden(res, 'No token provided', 403);
    }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await UserTable.findById(decoded.UserID).select('-password');
        if (!req.user) return responseHandler.unauthorized(res, 'Un Authorized user', 401);
        next();
    } catch (error) {
        console.error('JWT verification error:', error);
        responseHandler.error(res, 'Invalid token', 500);
    }
};

const getTokenUserDetails = async (req) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
        let user = await UserTable.findById(decoded.UserID);
        return user
    } return {}
};

module.exports = { sendEmail, saveFile, deleteFile, authMiddleware, getTokenUserDetails }