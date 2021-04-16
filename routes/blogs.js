// web page routes

// // const { response } = require('express');
// const { request } = require('express');
const { request, response } = require('express');
const express = require('express');

const Blog = require("../models/Blog");
const router = express.Router();

const multer = require('multer');

//define storage for image 
const storage = multer.diskStorage({ //diskStorage defines storage for images

    //destination of file
    destination : function(request,file,callback){
        callback(null,'./public/uploads/images')
    },

    //by default multer strips the extension , so we are add back the extension
    filename : function(request,file,callback){
        callback(null,Date.now()+file.originalname)
    },
});

//upload parameters for multer
const uploads = multer({
    storage : storage,
    limits : {
        fieldSize : 1024 * 1024 * 3,
    }
})

// router.get('/',(request,response)=>{
//     response.send("I am creating this index page route");
// });


router.get('/new',(request,response)=>{
    response.render("new.ejs");
});

//view the specified id with its full data
router.get('/:slug',async (request,response)=>{
    // response.send(request.params.id);
    let blog = await Blog.findOne({slug : request.params.slug});

    if(blog)
    {
        response.render('show',{blog : blog});
    }
    else
    {
        response.redirect('/');
    }
});

//route that handles new post 
router.post('/' ,uploads.single('image'),async (request,response)=>{
    // console.log(request.body);
    let blog = new Blog({
        title : request.body.title,
        author : request.body.author,
        description : request.body.description,
    });
    try
    {
        blog = await blog.save();
        response.redirect('blogs/' + blog.slug);
    }
    catch
    {
        console.log(error);
    }
});

//route that handles edit view
router.get('/edit/:id',async (request,response) => {
    let blog = await Blog.findById(request.params.id);
    response.render('edit',{blog : blog});
});

//put request from edit view
router.put('/:id',async (request,response) => {
    request.blog = await Blog.findById(request.params.id);
    let blog = request.blog;
    blog.title = request.body.title;
    blog.author = request.body.author;
    blog.description = request.body.description;
    try
    {
        blog = await blog.save();
        //redirect to view page
        response.redirect('/blogs/'+blog.slug);
    }
    catch(error)
    {
        console.log(error);
        response.redirect('/blogs/edit/'+blog.id,{blog:blog})
    }
});

//routes to handle delete
router.delete('/:id',async (request,response) => {
    await Blog.findByIdAndDelete(request.params.id);
    response.redirect('/');
})

module.exports = router;
