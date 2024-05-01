require('dotenv').config();
const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const mongodbConnection = require('./config/mongodb-connection');
const postService = require('./services/post-service');

// ### 템플릿 엔진 설정
app.engine(
    'handlebars',
    handlebars.create({
        helpers: require('./config/handlebars-helpers'),
    }).engine,
); // 템플릿 엔진 등록
app.set('view engine', 'handlebars'); // 웹 페이지 로드시 사용할 템플릿 엔진 등록
app.set('views', __dirname + '/views'); // 뷰 디렉터리 설정

// ### req.body, POST, application/x-www-form-urlencoded (키=값 형식)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ### home
app.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || '';

    try {
        const [posts, paginator] = await postService.list(collection, page, search);

        // views.home.handlebars 파일에 데이터를 렌더링
        res.render('home', { title: '테스트 게시판', search, paginator, posts });
    } catch (err) {
        console.error(err);
        res.render('home', { title: '테스트 게시판' });
    }
});

// ### 글쓰기 페이지
app.get('/write', (req, res) => {
    res.render('write', { title: '테스트 게시판', mode: 'create' });
});

app.post('/write', async (req, res) => {
    console.log(req.body);
    const post = req.body;
    const result = await postService.writePost(collection, post);
    res.redirect(`/detail/${result.insertedId}`);
});

app.get('/modify/:id', async (req, res) => {
    const post = await postService.getPostById(collection, req.params.id);
    console.log(post);
    res.render('write', { title: '테스트 게시판', mode: 'modify', post });
});

app.post('/modify/', async (req, res) => {
    const { id, title, writer, password, content } = req.body;

    const post = {
        title,
        writer,
        password,
        content,
        createdDt: new Date().toISOString(),
    };

    const result = postService.updatePost(collection, id, post);
    res.redirect(`/detail/${id}`);
});


// ### 상세 페이지
app.get('/detail/:id', async (req, res) => {
    const result = await postService.getDetailPost(collection, req.params.id);
    res.render('detail', {
        title: '테스트 게시판',
        post: result,
    });
});

app.post('/check-password', async (req, res) => {
    const { id, password } = req.body;
    const post = await postService.getPostByIdAndPassword(collection, { id, password });

    // 프론트에서 쓸거임
    if (!post) {
        return res.status(404).json({ isExist: false });
    } else {
        return res.json({ isExist: true });
    }
});

let collection;
app.listen(3000, async () => {
    console.log('Server started');

    const mongoClient = await mongodbConnection({
        authSource: 'admin',
        auth: {
            username: process.env['DB_ID'],
            password: process.env['DB_PASS'],
        },
    });

    collection = mongoClient.db().collection('post');
    console.log('MongoDB connected');
});