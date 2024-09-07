const mongoose = require("mongoose")

const customPackageSchema = mongoose.Schema({
    userInfo : {
        email:{
            type :String,
            required : true
        },
        name : {
            type :String,
            required : true
        },
        phoneNumber : {
            type : Number,
            required : true 
        }
    },
    packageInfo : {
        destination: {type : String , required : true},
        people: {type : Number , required : true},
        rooms: {type : Number , required : true},
        days: {type : Number , required : true},
        date: {type : String , required : true},
        transportation: {type : String , required : true},
    }
})

module.exports =new mongoose.model('customPackageSchema', customPackageSchema)