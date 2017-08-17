
//Setup requires
const express = require('express');
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const session = require('express-session');

const server = express();

const users = [
  { username: "mariel", password: "123", logins: 0 },
  { username: "bobby", password: "abc", logins: 0 },
  { username: "misch", password: "mememe", logins: 0 }
]

const messages = [];

//Configure the server
server.use(bodyparser.urlencoded({ extended: false }));
server.use(session({
    secret: '98rncailevn-_DT83FZ@',
    resave: false,
    saveUninitialized: true
}));

server.engine('mustache', mustache());
server.set('views', './views')
server.set('view engine', 'mustache');

//Set up some routes
server.get('/', function(request, response){
  response.render('mainpage');
})

server.get('/home', function(request, response) {
  if (request.session.cookie != undefined) {
    response.render('home', {
      username: request.session.cookie.username,
      logintimes: request.session.cookie.logins,
      messages: messages,
    });
  } else {
    response.redirect('/');
}
})

// 1. is the username real?
// 2. if so, does the password match?
server.post('/home', function(request, response) {
  let user = null;

  if (request.body.username === '' || request.body.password === '') {
    response.redirect('/')
  }

  for (let i = 0; i < users.length; i++) {
    const username = users[i].username;
    const password = users[i].password;

    if (username === request.body.username && password === request.body.password) {
      user = users[i];
    }

    if (user != null) {
      request.session.cookie = user;
      request.session.cookie.login++;
      response.redirect('/home')
    } else {
      response.redirect('/')
    }
  }
})


// Run the server
server.listen(3000, function() {
  console.log("It's twerking!");
})
