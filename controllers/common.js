const nodemailer = require("nodemailer");
const path = require('path')

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

module.exports = { sendEmail, saveFile, deleteFile }