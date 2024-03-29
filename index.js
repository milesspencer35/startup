const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const DB = require('./database.js');
const { peerProxy } = require('./peerProxy.js');

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

// DeleteAuth token if stored in cookie
apiRouter.delete('/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
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

// Get Current User
secureApiRouter.get('/getCurrentUser', async (req, res) => {
  authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);
  res.type('text/plain');
  res.send(user.username);
})

// Count services //

//getCount
secureApiRouter.get('/count', async (req, res) => {
  authToken = req.cookies[authCookieName];
  count = await createArray(await DB.getCount(authToken));
  res.send(count);
});
//updateCount
secureApiRouter.post('/updateCount', async (req, res) => {
  authToken = req.cookies[authCookieName];
  count = await createArray(await DB.updateCount(req.body, authToken));
  res.send(count);
});
//deleteCount
secureApiRouter.delete('/deleteCount', async (req, res) => {
  authToken = req.cookies[authCookieName];
  await DB.deleteCount(authToken);
  res.send(200);
});

// Item Service //

// get Items
secureApiRouter.get('/items', async (req, res) => {
  items = await createArray(await DB.getItems());
  res.send(items);
});
// add Item
secureApiRouter.post('/addItem', async (req, res) => {
  authToken = req.cookies[authCookieName];
  cursor = await DB.addItem(req.body, authToken);
  if (cursor === "Duplicate UPC") {
    res.status(409).send({msg: "duplicate"});
  } else {
    items = await createArray(cursor);
    res.send(items);
  }
});
// update Item
secureApiRouter.patch('/editItem', async (req, res) => {
  // items = editItem(req.body, items);
  cursor = await DB.updateItem(req.body.oldUPC, req.body.item);
  if (cursor === "Duplicate UPC") {
    res.status(409).send({msg: "duplicate"});
  } else {
    items = await createArray(cursor);
    res.send(items);
  }
});
// delete Item
secureApiRouter.patch('/deleteItem', async (req, res) => {
  items = await createArray(await DB.deleteItem(req.body.UPC));
  await DB.deleteCountItem(req.body.UPC);
  res.send(items);
});

async function createArray(cursor) {
  items = [];
  await cursor.forEach(doc => items.push(doc));
  return items;
}

// Return the application's default page if the path is unknown
app.use((_req, res) => {
    res.sendFile('login.html', { root: 'public' });
});

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

peerProxy(httpService);
