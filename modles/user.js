const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

main()
.then(()=>{
    console.log("Conncetion successful")
})
.catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Blog");
}

const userSchema = new mongoose.Schema({
        email:{
            type:String,
            require:true,
        },

})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema);
