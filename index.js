//Third Party Module
const express = require('express');
const app = express();
const cors = require("cors");
const mongoose = require("mongoose")
const fileUpload = require('express-fileupload');

require('dotenv').config()

//Middleware 
app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

//Router
let users = require("./routes/user");


app.use('/', users)

// Step 1
let PORT = process.env.PORT || 4040;

//Listen Port
app.listen(PORT, () => { console.log("Backend started at this port " + PORT); })

//DB Connection 
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log('Error in DB connection: ' + err));
