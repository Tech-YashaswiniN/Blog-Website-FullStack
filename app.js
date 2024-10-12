const express = require("express");
const app = express();
const path= require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Blog = require("./modles/blog.js")
const port = 3001;
const ejsMate = require("ejs-mate");
const ExpressErrors = require("./middleware.js");
const asyncWrap = require("./utils/wrapAsync.js");
const passport = require('passport');
const LocalStrategy = require("passport-local");
const session = require('express-session');
const flash = require('connect-flash');

const User = require('./modles/user.js');
const blogsRouter = require('./routes/blogs.js');
const userRouter = require('./routes/user.js');

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


app.use(methodOverride("_method"));


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.use(express.static(path.join(__dirname,"/public/css")));
app.use(express.static(path.join(__dirname,"/public/js")));
app.use(express.static(path.join(__dirname,"/public/images")));


app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.engine("ejs",ejsMate);


const sessionOptions = {
    secret : "mySuperSceretCode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //(model.authenticate)


// serializeUser means when user is logedIn store that person in a session, so for the specific expiry date user no need to login again and again.
// deserializeUser means delete the user from the session who loged out.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

// not required for this code - i just confirm it how it will work 

// app.get('/fakeuser',async(req,res)=>{
//     let fakeUser = new User({
//         email:"yn@gamil.com",
//         username:"yn",
//     })
//     let registeredUser = await User.register(fakeUser, "helloword"); //register(user, password, callBack) it is a static method. convenience method to register a new user instance with a given password checks if username is unquie.
//     res.send(registeredUser);
// })

// routing applied here

app.use('/blogs',blogsRouter);
app.use('/',userRouter);

// Write this in a utils folder using arrow function

// function asyncWrap(fn){
//     return function(req,res,next){
//         fn(req,res,next).catch(err=>next(err));
//     }
// }

app.use("*",(req,res,next)=>{
    next(new ExpressErrors(404,"Page Not found"));
})

app.use((err,req,res,next)=>{
    let {status=404,message="Page Not Found"}=err;
    res.render("error.ejs",{message});
    // res.status(status).send(message);
})


app.listen(port,()=>{
    console.log("Server is listening on", port);
})


