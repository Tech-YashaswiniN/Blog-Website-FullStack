const express = require('express');
const router = express.Router();
const asyncWrap = require("../utils/wrapAsync.js");
const Blog = require("../modles/blog.js");
const ExpressErrors = require("../middlewareExpressError.js");
const { idLoggedIn } = require("../middleware.js");

// Show all blogs
router.get('/', asyncWrap(async (req, res) => {
    let blogs = await Blog.find();
    res.render("index.ejs", { blogs });
}));

// Search blogs
router.get('/search', async (req, res) => {
    const searchQuery = req.query.q;
    if (!searchQuery) {
        return res.redirect('/');
    }
    const filteredBlogs = await Blog.find({
        $or: [
            { title: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } }
        ]
    });
    if (filteredBlogs.length === 0) {
        req.flash("error", "No blogs found for your search.");
    }
    res.render('search', { blogs: filteredBlogs, searchQuery });
});

// Create new blog page
router.get('/new', idLoggedIn, (req, res) => {
    res.render("new.ejs");
});

// Create new blog
router.post('/', asyncWrap(async (req, res, next) => {
    const bloglists = req.body.blog;
    if (!bloglists) {
        return next(new ExpressErrors(400, "Please enter valid blog list"));
    }

    // Create new blog and assign the current user as owner
    const newBlog = new Blog({
        title: bloglists.title,
        author: bloglists.author,
        description: bloglists.description,
        tag: bloglists.tag,
        image: bloglists.image,
        content1: bloglists.content1 || "", // Default to an empty string if content1 is not provided
        owner: req.user._id
    });

    await newBlog.save();
    req.flash("success", "New blog created");
    res.redirect("/blogs");
}));

// Show blogs written by the logged-in user
router.get('/myblogs', idLoggedIn, asyncWrap(async (req, res) => {
    let blogs = await Blog.find().populate("owner");
    const userBlogs = blogs.filter(blog => blog.owner && blog.owner._id.equals(req.user._id));
    if (userBlogs.length === 0) {
        req.flash("error", "You don't have any blogs!");
        return res.redirect('/blogs');
    }
    res.render('myblogs.ejs', { blogs: userBlogs, CurrentUser: req.user });
}));

// Show single blog by ID
router.get('/:id', asyncWrap(async (req, res, next) => {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("owner");
    if (!blog) {
        req.flash("error", "Blog you are looking for does not exist!");
        return res.redirect('/blogs');
    }
    res.render("show.ejs", { blog });
}));

// Edit blog page
router.get('/:id/edit', idLoggedIn, asyncWrap(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
        req.flash("error", "Blog you are looking for does not exist!");
        return res.redirect('/blogs');
    }
    res.render("edit.ejs", { blog });
}));

// Update blog content1
router.patch('/:id', idLoggedIn, asyncWrap(async (req, res) => {
    const { id } = req.params;
    const { content1 } = req.body.blog;  // Extract content1 from the form

    if (!content1) {
        req.flash("error", "Content cannot be empty.");
        return res.redirect(`/blogs/${id}/edit`);
    }

    // Update content1 for the specified blog
    const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        { content1 },  // Only update content1
        { runValidators: true, new: true }
    );

    if (!updatedBlog) {
        req.flash("error", "Blog not found");
        return res.redirect('/blogs');
    }

    req.flash("success", "Blog Updated!");
    res.redirect(`/blogs/${id}`);
}));


// Delete a blog
router.delete('/:id', idLoggedIn, asyncWrap(async (req, res) => {
    const { id } = req.params;
    await Blog.findByIdAndDelete(id);
    req.flash("success", "Blog deleted!");
    res.redirect("/blogs");
}));

module.exports = router;
