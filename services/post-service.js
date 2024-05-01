const paginator = require('../utils/paginator');

async function writePost(collection, post) {
    // 조회수, 생성일시는 자동으로 넣어주기
    post.hits = 0;
    post.createdDt = new Date().toISOString();
    return await collection.insertOne(post);
}

async function list(collection, page, search) {
    const perPage = 10;
    const query = {title: new RegExp(search, 'i')}; // i flag 대소문자 제거
    const cursor = collection.find(query, {limit: perPage, skip: (page - 1) * perPage}).sort({createdDt: -1});

    const totalCount = await collection.count(query);
    const posts = await cursor.toArray(); // 커서로 받은 데이터를 리스트 형태로

    const paginatorObj = paginator({totalCount, page, perPage});
    return [posts, paginatorObj];
}

module.exports = {
    writePost,
    list,
};