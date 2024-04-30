require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = `mongodb://${process.env['DB_ID']}:${process.env['DB_PASS']}@localhost:27017/board`;
const client = new MongoClient(uri, { authSource: 'admin' });

async function run() {
    try {
        const board = client.db('board').collection('test');
        await board.insertOne({ name: '파묘' });
        const movie = await board.findOne({ name: '파묘' });
        console.log(movie);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);
