const mongoose = require("mongoose");


const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true,
    },
    author:{
        type:String,
        require:true,
    },
    dateCreated:{
        type:Date,
        default:new Date(),
    },
    tag:{
        type:String,
        require:true,
    },
    image:{
        type:String,
        require:true,
    },
    description:{
        type:String,
        require:true,
    },
    content1:{
        type:String,
    },
    content2:{
        type:String,
    },
    content3:{
        type:String,
    },
    content4:{
        type:String,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
})

const Blog = mongoose.model("Blog",blogSchema);
module.exports = Blog