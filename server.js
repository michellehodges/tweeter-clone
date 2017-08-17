
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
  if (request.session.who !== undefined) {
    response.render('home', {
      username: request.session.who.username,
      logintimes: request.session.who.logins,
      messages: messages,
    });
  } else {
    response.redirect('/');
}
})

server.get('/logout', function(request, response) {
  response.render('logout')
})

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
      request.session.who = user;
      request.session.who.login++;
      response.redirect('/home')
    } else {
      response.redirect('/')
    }
  }
})

server.post('/message', function (request, response) {
  messages.push({
    message: request.body.message,
    username: request.session.who
  });
  response.redirect('/home');
})

server.post('/logout', function(request, response) {
  request.session.destroy(function() {
    response.redirect('/logout')
  })
})

// Run the server
server.listen(3000, function() {
  console.log("It's twerking!");
})
