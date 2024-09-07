const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    id:{
        required: true,
        type:String
    },
    comments:[{
        comment:{type:String, required:true},
        createdBy:{type:String, required:true},
        createdAt:{type:String, required:true},
        rating:{type:Number, required:true}
    }]
})


module.exports = new mongoose.model('comments',commentSchema)