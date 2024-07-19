const mongoose = require("mongoose")
const todoSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'user',
        required:true
    },
    userName: {
        type: String,
        required: false // Ensure that this field is required if necessary
      }

},{timestamps:true})


module.exports = mongoose.model("Todo", todoSchema)