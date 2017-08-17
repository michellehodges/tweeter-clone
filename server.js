//Dependencies
const express = require('express');
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const session = require('express-session');

const server = express();

const users = [
  { username: "mariel", password: "123", logins: 0, clicks: 0 },
  { username: "bobby", password: "abc", logins: 0, clicks: 0 },
  { username: "misch", password: "mememe", logins: 0, clicks: 0 }
]

const messages = [];

//Server configure
server.use(bodyparser.urlencoded({ extended: false }));
server.use(session({
    secret: '98rncailevn-_DT83FZ@',
    resave: false,
    saveUninitialized: true
}));

server.engine('mustache', mustache());
server.set('views', './views')
server.set('view engine', 'mustache');

//Get requests
server.get('/', function(request, response){
  response.render('mainpage');
})

server.get('/home', function(request, response) {
  if (request.session.who !== undefined) {
    response.render('home', {
      username: request.session.who.username,
      logintimes: request.session.who.logins,
      clicktimes: request.session.who.clicks,
      messages: messages,
    });
  } else {
    response.redirect('/');
  }
})

server.get('/logout', function(request, response) {
  response.render('logout')
})

server.get('/signup', function(request, response) {
  response.render('signup')
})


//Post requests
server.post('/home', function(request, response) {
  let user = null;

  if (request.body.username === '' || request.body.password === '') {
    response.redirect('/')
  }

  for (let i = 0; i < users.length; i++) {
    let username = users[i].username;
    let password = users[i].password;

    if (username === request.body.username && password === request.body.password) {
      user = users[i];
      console.log(user);
    }
  }

  if (user !== null) {
    request.session.who = user;
    request.session.who.logins++;
    response.redirect('/home')
  } else {
    response.redirect('/')
  }

})

server.post('/signup', function(request, response) {
  const username = request.body.newUsername;
  const password = request.body.newPassword;

  if (username !== null && password !== null)
    users.push({
      username: request.body.newUsername,
      password: request.body.newPassword,
      logins: 0
    })
  console.log(users)
  response.redirect('/signup')
})

server.post('/click', function (request, response) {
  request.session.who.clicktimes++;
})

server.post('/messages', function (request, response) {
  messages.push({
    msg: request.body.message,
    username: request.session.who.username
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
