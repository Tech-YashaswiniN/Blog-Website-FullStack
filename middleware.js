module.exports.idLoggedIn = (req,res,next)=>{
    // console.log(req.user)
    // console.log(req.path, "...", req.originalUrl) //after loged in we wanted to go to /new route to  create blog - but once we logged in it will redirect us to /blogs page - Lets update it for the user convience
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create blog!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}