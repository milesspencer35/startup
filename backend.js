const express = require('express');
const app = express();

// The service port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// User Services

// Add user
apiRouter.post('/register', (req, res) => {
  users = updateUsers(req.body, users);
  res.send(users);
});
// Get User
apiRouter.get('/users', (req, res) => {
  res.send(users);
});
// Set Current User
apiRouter.put('/setCurrentUser', (req, res) => {
  currentUser = req.body.username;
  res.send(currentUser);
});
// Get Current User
apiRouter.get('/getCurrentUser', (req, res) => {
  res.type('text/plain');
  res.send(currentUser);
})

// Count services

//getCount
apiRouter.get('count', (req, res) => {
  res.send(count);
});
//updateCount
apiRouter.put('/updateCount', (req, res) => {
  count = new Map(Object.entries(JSON.parse(req.body)));
});
//deleteCount
apiRouter.delete('/deleteCount', (req, res) => {
  count = new Map();
  res.send(count);
});

// Item Service

// get Items
apiRouter.get('/items', (req, res) => {
  res.send(items);
});
// add Item
apiRouter.post('/addItem', (req, res) => {
  req.body.user = currentUser;
  items.push(req.body);
  res.send(items);
});
// update Item
apiRouter.patch('/updateItem', (req, res) => {
  items = updateItem(req.body, items);
  res.send(items);
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// User Logic
let users = [];
let currentUser = "";

function updateUsers(newUser, users) {
  users.push(newUser);
  return users;
}

// Count Logic
let count = new Map();

// Item logic
let items = [];

function updateItem(editedInfo) {
  let editedItemIndex = items.findIndex((item) => item.UPC == editedInfo.oldUPC);
  editedInfo.item.user = currentUser;
  items.splice(editedItemIndex, 1, editedInfo.item);
  return items;
}