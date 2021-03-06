//blog routes
const express = require('express');
const Blog = require('../models/Blog');
const router = express.Router();

// const User = require("./../models/user");

// 로그인 미들웨어
// const authMiddleware = require("./../middlewares/auth-middleware");
// const { response } = require('express');
// const user = require('./../models/user');


router.get('/new', (request, response) => {
    response.render('new');
});

//route that handles new post
router.post('/new', async (request, response) => {
    console.log(request.body); // TODO
    // -> 빈 데이터로 들어옴 {}
    let blog = new Blog({
        title: request.body.title,
        author: request.body.author,
        description: request.body.description,
    });

    try {
        console.log("1")
        blog = await blog.save();
        // await blog.create({ title, author, description});
        // response.redirect(`/`);
     
    } catch (error) {
        console.log("2")
        console.log(error);
        return;
    }
    response.send("hello")
});




// router.get('/login', (request, response) => {
//     response.render('login');
// });
// // 로그인 및 회원가입 -> 3주 강의 내용 복붙 수정하기
// router.post("/login", async (req, res) => {
//     user = new User({
//         nickname: req.body.nickname,
//         id: req.body.id,
//         email: req.body.email,
//         password: req.body.password
//     });

//     // console.log(user);
//     const existUsers = await User.find({
//             $or: [{ email }, { nickname }],
//     });
    
//     // if (password !== confirmPassword) {
//     //     res.status(400).send({
    //         errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.',
    //     });
    //     return;
    // }
    
    // if (existUsers.length) {
    //     res.status(400).send({
    //         errorMessage: '이미 가입된 이메일 또는 닉네임이 있습니다.',
    //     });
    //     return;
    // }

//     await user.save()
//     .then(() => console.log("Saved Successfully"));
//     res.status(201), send({});
// });

// 로그인 페이지로 가는 api
// router.post('/login', async (request, response)=> {
//     console.log(request.body);
// });

// 로그인 api
// router.post("/auth", async (req, res) => {
//     const { email, password } = req.body;

    // 일치하는 유저가 있는 지 확인
    // const user = await User.findOne({ email, password }).exec();
    // 일치하는 유저가 없다면 보낼 에러 메시지
    // 자꾸 send()다음에 바로 소괄호 닫는 실수.. !! 조심 
    // if (!user) {
    //     res.status(400).send({
    //         errorMessage: '이메일 또는 패스워드가 잘못됐습니다.'
    //     });
    //     return;
    // }

    // 우선 jwt를 가져와야 함. 위에 추가, sign이 있어야 토큰을 만들 수 있음.
    // const token = jwt.sign({ userId: user.userId }, "my-secret-key");
    // 토큰을 만들었으니, 이제 응답해주면 됨, 응답할 때도 토큰을 불러야 프론트엔드쪽에서 제대로 실행
//     res.send({
//         token,
//     });
// });


// authMiddleware // TODO
// router.get("/users/me", authMiddleware, async (req, res) => {
//     const { user } = res.locals;
//     // console.log(user);
//     res.send({
//         user
//     });
// });

// view route
// response.redirect('blogs/${blog.id}') 여기서 blog.id 파라메터를 써서 쓴 라우터입니다.=
router.get('/blogs/detail/:slug', async (request, response) => {
    // console.log(request.params.slug)
    let blog = await Blog.findOne({ slug: request.params.slug });
    console.log(blog)
    if (blog) {
        response.render('show', {blog:blog});
    // } else {
    //     response.redirect('/')
    // };
};
});

// app.use("/api", express.urlencoded({ extended: false }), router);
// app.use(express.static("assets"));


// route that handles edit view
router.get('/edit/:id', async (request, response) => {
    let blog = await Blog.findById(request.params.id);
    response.render('edit', { blog: blog });
});

// route to handle updates
router.put('/:id', async (request, response) => {
    request.blog = await Blog.findById(request.params.id)
    let blog = request.blog;
    blog.title = request.body.title;
    blog.author = request.body.author;
    blog.description = request.body.description;

    try {
        blog = await blog.save();
        // redirect to the view route
        response.redirect(`/blogs/${blog.slug}`);
    } catch (error) {
        console.log(error)
        response.redirect(`/blogs/edit${blog.id}`, { blog: blog });
    }
});

// 삭제 라우터
router.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id);
    response.redirect('/');
});

module.exports = router;