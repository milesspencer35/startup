const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const DB = require('./database.js');

const authCookieName = 'token';

// The service port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Trust headers that are forwarded from the proxy so we can determine IP addresses
app.set('trust proxy', true);

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// secureApiRouter verifies credentials for endpoints
var secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// User Services //

// CreateAuth token for a new user
apiRouter.post('/register', async (req, res) => {
  if (await DB.getUser(req.body.username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createUser(req.body.username, req.body.password, req.body.email);

    // Set the cookie
    setAuthCookie(res, user.token);

    res.send({
      id: user._id,
    });
  }
});

// GetAuth token for the provided credentials
apiRouter.post('/login', async (req, res) => {
  const user = await DB.getUser(req.body.username);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// Get User
apiRouter.get('/users/:username', async (req, res) => {
  const user = await DB.getUser(req.params.username);
  if (user) {
    const token = req?.cookies.token;
    res.send({ username: user.username, email: user.email, authenticated: token === user.token });
    return;
  }
  res.status(404).send({ msg: 'Unknown' });
});

// Get Current User
secureApiRouter.get('/getCurrentUser', async (req, res) => {
  authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);
  res.type('text/plain');
  res.send(user.username);
})

// Count services //

//getCount
apiRouter.get('/count', (req, res) => {
  res.send(Object.fromEntries(count));
});
//updateCount
apiRouter.post('/updateCount', (req, res) => {
  count = new Map(Object.entries(req.body));
  res.send(Object.fromEntries(count));
});
//deleteCount
apiRouter.delete('/deleteCount', (req, res) => {
  count = new Map();
  res.send(count);
});

// Item Service //

// get Items
secureApiRouter.get('/items', async (req, res) => {
  // cursor = await DB.getItems();
  items = await createItemsArray(await DB.getItems());
  res.send(items);
});
// add Item
secureApiRouter.post('/addItem', async (req, res) => {
  cursor = await DB.addItem(req.body);
  if (cursor === "Duplicate UPC") {
    res.status(409).send({msg: "duplicate"});
  } else {
    items = await createItemsArray(cursor);
    res.send(items);
  }
});
// update Item
apiRouter.patch('/editItem', async (req, res) => {
  // items = editItem(req.body, items);
  items = await DB.updateItem(req.body.oldUPC, req.body.item);
  res.send(items);
});
// delete Item
apiRouter.patch('/deleteItem', async (req, res) => {
  items = await DB.deleteItem(req.body.UPC);
  res.send(items);
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
    res.sendFile('login.html', { root: 'public' });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// User Logic
// let users = [];
// let currentUser = "";

// function updateUsers(newUser, users) {
//   users.push(newUser);
//   return users;
// }

// Count Logic
let count = new Map();

// Item logic
// let items = [];

// function editItem(editedInfo) {
//   let editedItemIndex = items.findIndex((item) => item.UPC == editedInfo.oldUPC);
//   editedInfo.item.user = currentUser;
//   items.splice(editedItemIndex, 1, editedInfo.item);
//   return items;
// }

// function deleteItem(deleteItem) {
//   let deleteItemIndex = items.findIndex((item) => item.UPC == deleteItem.UPC);
//   items.splice(deleteItemIndex, 1);
//   return items;
// }

async function createItemsArray(cursor) {
  items = [];
  await cursor.forEach(doc => items.push(doc));
  return items;
}