const mongoose = require("mongoose")

const tripSchema = mongoose.Schema({
    title:{
        type: String ,
        required: true,
    },
    para:{
        type: String,
        required: true,
    },
    img:{
        type:String,
        required: true,
    }
})
module.exports = new mongoose.model('tripData', tripSchema)