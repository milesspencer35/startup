const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
const countCollection = db.collection('count');
const itemCollection = db.collection('item');
itemCollection.createIndex( { "UPC": 1 }, { unique: true } );

(async function testConnection() {
    await client.connect();
    await db.command({ ping: 1 });
})().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
});



// User Collection //

async function createUser(username, password, email) {
    const passwordHash = await bcrypt.hash(password, 10);
  
    const user = {
      username: username,
      password: passwordHash,
      email: email,
      token: uuid.v4(),
    };
    await userCollection.insertOne(user);
  
    return user;
}

function getUser(username) {
    return userCollection.findOne({ username: username });
}
  
function getUserByToken(token) {
    return userCollection.findOne({ token: token });
}

// Count Collection //



// Item Collection



async function getItems() {
    return await itemCollection.find();
}

async function addItem(item) {
    try {
        await itemCollection.insertOne(item);
        return await getItems();
    } catch (error) {
        return "Duplicate UPC";
    }
}

function deleteItem(itemUPC) {
    itemCollection.deleteOne({UPC : itemUPC});
}

async function updateItem(oldItemUPC, newItem) {
    try {
        await itemCollection.replaceOne({UPC : oldItemUPC}, newItem);
        return await getItems();
    } catch (error) {
        return "Duplicate UPC";
    }
   
}

module.exports = {
    createUser,
    getUser,
    getUserByToken,
    getItems,
    addItem,
    deleteItem,
    updateItem
};