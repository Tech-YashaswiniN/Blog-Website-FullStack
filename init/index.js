const mongoose = require("mongoose");
const Blog = require("../modles/blog.js");
const initData = require('./data.js');

const ATLASDB_URL = "mongodb+srv://webdesigningyt:BeEwIG0IQzPfBZZy@cluster0.uoglo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

main()
.then((res)=>{
    console.log("Data stored successfully.");
})
.catch((err)=>{
    console.log(err);
})


async function main(){
    await mongoose.connect(ATLASDB_URL);
}

async function initDb(){
    await Blog.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:'672c4d462c83e2df670ceb53'}));
    await Blog.insertMany(initData.data);
    console.log("data initialized");
}

initDb();
