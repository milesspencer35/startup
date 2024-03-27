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

async function updateCount(countItem) {
    // user = {  // figure out how to have a count per user

    // }
    await countCollection.updateOne({UPC : countItem.UPC}, {"$set": countItem}, {upsert:true});
    return await getCount();
}

async function getCount() {
    return await countCollection.find();
}

async function deleteCount() {
    await countCollection.deleteMany({});
}

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

async function deleteItem(itemUPC) {
    await itemCollection.deleteOne({UPC : itemUPC});
    return await getItems();
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
    updateCount,
    getCount,
    deleteCount,
    getItems,
    addItem,
    deleteItem,
    updateItem
};