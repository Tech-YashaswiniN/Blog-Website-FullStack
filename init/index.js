const mongoose = require("mongoose");
const Blog = require("../modles/blog.js");
const initData = require('./data.js');

main()
.then((res)=>{
    console.log("Data stored successfully.");
})
.catch((err)=>{
    console.log(err);
})


async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Blog");
}

async function initDb(){
    await Blog.deleteMany({});
    await Blog.insertMany(initData.data);
    console.log("data initialized");
}

initDb();
