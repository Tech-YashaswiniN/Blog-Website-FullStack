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
    initData.data = initData.data.map((obj)=>({...obj, owner:'672762adc88cb9bfd1651621'}));
    await Blog.insertMany(initData.data);
    console.log("data initialized");
}

initDb();
