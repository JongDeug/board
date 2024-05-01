const { MongoClient } = require('mongodb');
const uri = `mongodb://localhost:27017/board`;

function connectToDB(options) {
    return MongoClient.connect(uri, options);
}

module.exports = connectToDB;
