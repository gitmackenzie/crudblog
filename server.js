const express = require ('express');

//bring in mongoose
const mongoose = require('mongoose');

// method override 가져오기
const methodOverride = require('method-override');

// const methodOverride = require('method-override');

const blogRouter = require('./routes/blogs')
// Blog 라우터 for "let Blog ="
const Blog = require('./models/Blog')
const app = express()


//connect to mongoose
mongoose.connect('mongodb://localhost/crudeblog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
});


//set template engine
app.set('view engine', 'ejs');
    // let ejsOptions = {
    //     async:true
    // };
app.use(express.urlencoded({ extended: false}));
app.use(methodOverride('_method'));

//route for the index
app.get('/', async (request, response)=>{
    // const blogs = [] 스키마를 없애고, Blog.js로 대체
    // 그런 다음 descending order 시간 순으로 배열
    let blogs = await Blog.find().sort({timeCreated:'desc'});

    // const blogs = [
    //     {
    //         title:  'The information we do not need',
    //         snipeet: 'hellloooooo',
    //         author: 'Mackenzie',
    //         createdAt: new Date,
    //         img: 'placeholder.jpg'
    //     },
    //     {
    //         title:  'The information we do not need',
    //         snipeet: 'hellloooooo',
    //         author: 'Mackenzie',
    //         createdAt: new Date,
    //         img: 'placeholder.jpg'
    //     }
    // ]
    response.render('index', { blogs: blogs})
});

app.use(express.static("public"))
app.use('/blogs', blogRouter);

//listen port
app.listen(5000)