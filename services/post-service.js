const paginator = require('../utils/paginator');
const { ObjectId } = require('mongodb');

async function writePost(collection, post) {
    // 조회수, 생성일시는 자동으로 넣어주기
    post.hits = 0;
    post.createdDt = new Date().toISOString();
    return await collection.insertOne(post);
}

async function list(collection, page, search) {
    const perPage = 10;
    const query = { title: new RegExp(search, 'i') }; // i flag 대소문자 제거
    const cursor = collection.find(query, { limit: perPage, skip: (page - 1) * perPage }).sort({ createdDt: -1 });

    const totalCount = await collection.count(query);
    const posts = await cursor.toArray(); // 커서로 받은 데이터를 리스트 형태로

    const paginatorObj = paginator({ totalCount, page, perPage });
    return [posts, paginatorObj];
}

const projectionOption = {
    projection: {
        password: 0,
        'comments.password': 0,
    },
};

async function getDetailPost(collection, id) {
    return await collection.findOneAndUpdate({ _id: new ObjectId(id) }, { $inc: { hits: 1 } }, projectionOption);
}

async function getPostByIdAndPassword(collection, { id, password }) {
    return await collection.findOne({ _id: new ObjectId(id), password }, projectionOption);
}

async function getPostById(collection, id) {
    return await collection.findOne({ _id: new ObjectId(id) }, projectionOption);
}

async function updatePost(collection, id, post) {
    const toUpdatePost = {
        $set: {
            ...post,
        },
    };
    return await collection.updateOne({ _id: new ObjectId(id) }, toUpdatePost);
}

module.exports = {
    writePost,
    list,
    getDetailPost,
    getPostByIdAndPassword,
    getPostById,
    updatePost,
};