const mongoose = require("mongoose")

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    tokens:[{type:Object}],
    resetlink:{type:Object}
})

module.exports = new mongoose.model('userinfos', userSchema)