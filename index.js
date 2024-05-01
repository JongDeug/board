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
app.get('/', (req, res) => {
    // views.home.handlebars 파일에 데이터를 렌더링
    res.render('home', { title: '안녕하세요' });
});

// ### 글쓰기 페이지
app.get('/write', (req, res) => {
    res.render('write', { title: '테스트 게시판' });
});

app.post('/write', async (req, res) => {
    console.log(req.body);
    const post = req.body;
    const result = await postService.writePost(collection, post);
    res.redirect(`/detail/${result.insertedId}`);
});

// ### 상세 페이지
app.get('/detail/:id', async (req, res) => {
    res.render('detail', {
        title: '테스트 게시판',
    });
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