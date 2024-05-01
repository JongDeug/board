async function writePost(collection, post) {
    // 조회수, 생성일시는 자동으로 넣어주기
    post.hits = 0;
    post.createdDt = new Date().toISOString();
    return await collection.insertOne(post);
}

module.exports = {
    writePost,
};