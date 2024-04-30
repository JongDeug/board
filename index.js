// require('dotenv').config();
// const { MongoClient } = require('mongodb');
//
// const uri = `mongodb://${process.env['DB_ID']}:${process.env['DB_PASS']}@localhost:27017/board`;
// const client = new MongoClient(uri, { authSource: 'admin' });
//
// async function run() {
//     try {
//         const board = client.db('board').collection('test');
//         await board.insertOne({ name: '파묘' });
//         const movie = await board.findOne({ name: '파묘' });
//         console.log(movie);
//     } finally {
//         await client.close();
//     }
// }
//
// run().catch(console.dir);
const express = require('express');
const handlebars = require('express-handlebars');
const app = express();

app.engine('handlebars', handlebars.engine()); // 템플릿 엔진 등록
app.set('view engine', 'handlebars'); // 웹 페이지 로드시 사용할 템플릿 엔진 등록
app.set('views', __dirname + '/views'); // 뷰 디렉터리 설정

app.get('/', (req, res) => {
    // views.home.handlebars 파일에 데이터를 렌더링
    res.render('home', { title: '안녕하세요' });
});

app.get('/write', (req, res) => {
    res.render('write', { title: '테스트 게시판' });
});

app.listen(3000, () => console.log('listening on port 3000'));