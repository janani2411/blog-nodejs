const express = require('express');

//import mongoose 
const mongoose = require('mongoose');

//import method override
const methodOverride = require('method-override');

const blogRouter =  require('./routes/blogs.js');

const Blog = require('./models/Blog');

const app = express()

//connect to mongob
mongoose.connect('mongodb://localhost/crudoperation',{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex : true});
 
//before rendering html ,set template engine 
app.set('view engine' , 'ejs'); //here view engine is ejs

app.use(express.urlencoded({extended : false}));

app.use(methodOverride('_method'));

//creating route for the index
app.get('/',async (request,response)=>{
    // response.send("I am creating route for index");
    // response.render('index' ,{sample : "Sample text"});
    
    //sort data by date
    let blogs = await Blog.find().sort({createdAt : 'desc'});
    //  const blogs =[ 
    //     {
    //     title : "Person name",
    //     snippet : "Lorem Ipsum is simply dummy text "+
    //     "of the printing and typesetting industry. ..." + 
    //     "will be distracted by the readable content of " + 
    //     "a page when looking at its layout.",
    //     author : "someperson",
    //     createdAt : new Date,
    //     img : "ai.jpg"
    //     },
    //     {
    //         title : "Person name",
    //         snippet : "Lorem Ipsum is simply dummy text "+
    //         "of the printing and typesetting industry. ..." + 
    //         "will be distracted by the readable content of " + 
    //         "a page when looking at its layout.",
    //         author : "someperson",
    //         createdAt : new Date,
    //         img : "ai.jpg"
    //         }
    //     ]
    
    response.render('index',{blog : blogs});
});


//Use the public folder for accessing images folder statically
app.use(express.static("public"));
// using blogRouter
app.use('/blogs',blogRouter);


//creating route for the home page
app.get('/about',(request,response)=>{
    response.send("I am creating route for Home page");
});



//create port and listen port
//used to bind and listen the connections on the specified host and port.
app.listen(5000)