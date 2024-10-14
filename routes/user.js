const express = require("express");
const router  = express.Router();
const User  = require("../modles/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

router.get('/signup',(req,res)=>{
    res.render('users/signUp.ejs');
})

router.post('/signup',wrapAsync(async (req,res)=>{
    try{
        let {username, email, password} = req.body;
        let newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password); //register(user, password, callBack) it is a static method. convenience method to register a new user instance with a given password checks if username is unquie.
        console.log(registeredUser);
        // This is for automatically log in the user after signup using passport inbuilt method called req.login(with a 'error' parameter)
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", `Welcome to CreativeVesre ${username}`);
            res.redirect('/blogs');
        })
    }
    // here it ends - automatically login process

    catch(err){
        req.flash("error",err.message);
        res.redirect('/signup')
    }

}))

router.get('/login',(req,res)=>{
    res.render('users/login.ejs');
})

router.post('/login',saveRedirectUrl, passport.authenticate("local",{
    failureRedirect:"/login", 
    failureFlash:true
}), 
async (req,res)=>{
   req.flash("success","Welcome back to CreativeVerse you are loged in!");
   let redirectUrl = res.locals.redirectUrl || "/blogs"
   res.redirect(redirectUrl);

})

router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out now!");
        res.redirect('/blogs')
    })
})

module.exports = router;