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
apiRouter.put('/currentUser', (req, res) => {
  currentUser = req.body;
  res.send(currentUser);
});


// Return the application's default page if the path is unknown
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

let users = [];
let currentUser = "";

function updateUsers(newUser, users) {
  users.push(newUser);
  return users;
}