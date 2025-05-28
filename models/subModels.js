const mongoose = require("mongoose");

const Users = new mongoose.Schema({
    userName:
    {
        type: String,
    },
    userMail:
    {
        type: String,
    },
    userPhone:
    {
        type: String,
    },
    userPassword:
    {
        type: String,
    },
    userDetails:
    {
        type: String,
    },
    wishlist: [{ type: mongoose.Schema.ObjectId, ref: 'product' }],
    addresses: [{
        city: String,
        street: String,
        pincode: String,
        phone: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    created:
    {
        type: Date
    }
},{
  timestamps: true 
})

const Categories = new mongoose.Schema({
    categoryName: {
        type: String,
    },
    subCategory: {
        type: Array
    },
    isActive: {
        type: Boolean,
        default: true
    }
})


const UserTable = mongoose.model("Users", Users);
const CategoriesTable = mongoose.model("Category", Categories);

module.exports = { UserTable, CategoriesTable }
