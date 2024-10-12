const express = require('express');
const router = express.Router();
const asyncWrap = require("../utils/wrapAsync.js");
const Blog = require("../modles/blog.js")
const ExpressErrors = require("../middleware.js");

router.get('/',asyncWrap(async (req,res)=>{
    let blogs = await  Blog.find();
    res.render("index.ejs",{blogs});
}));

router.get('/new', (req,res)=>{
// throw new ExpressErrors(404,"Pae not found")
res.render("new.ejs")
})

router.post('/', asyncWrap(async(req,res)=>{
const bloglists = req.body.blog;
if(!req.body.blog){
    next(new ExpressErrors(400,"Please enter valid blogList"))
}
const newblog = new Blog(bloglists);
await newblog.save();
req.flash("success","New blog created");
res.redirect("/blogs");
}));

router.get('/:id', asyncWrap(async (req,res,next)=>{

    let{id}=req.params;
    let blog = await Blog.findById(id);
    if(!blog){
        req.flash("error","Blog you are looking for is not exist!");
        res.redirect('/blogs');
    }
res.render("show.ejs",{blog})
}));


router.get('/:id/edit',asyncWrap(async (req,res)=>{

    let{id}=req.params;
    let blog = await Blog.findByIdAndUpdate(id);
    if(!blog){
        req.flash("error","Blog you are looking for is not exist!");
        res.redirect('/blogs');
    }
    res.render("edit.ejs",{blog});
}));


router.patch('/:id', asyncWrap(async (req,res)=>{

    let{id}=req.params;

    let {content1:newContent1, content2:newContent2, content3:newContent3, content4:newContent4} = req.body;
    let updatedChat = await Blog.findByIdAndUpdate(id, {content1:newContent1, content2:newContent2, content3:newContent3, content4:newContent4}, {runValidators:true, new:true} )
    req.flash("success","Blog Updated!");
    res.redirect(`/blogs/${id}`);

}));

router.delete('/:id',asyncWrap(async (req,res)=>{
    let{id}=req.params;
    let deletedBlog = await Blog.findByIdAndDelete(id);
    // console.log(deletedBlog);
    req.flash("success","Blog deleted!");
    res.redirect("/blogs")    
}));


module.exports = router;