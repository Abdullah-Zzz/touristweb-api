const mongoose = require("mongoose")
require('dotenv').config();

const DBurl= process.env.MONGO_URL_LOCAL

const connectDB = mongoose.connect(DBurl)
                  .then(() =>{
                    console.log("connected")
                  })
                  .catch(err =>{
                    console.log("Error: " + err)
                  })
                  
module.exports = connectDB