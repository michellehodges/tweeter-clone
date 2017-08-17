
//Setup requires
const express = require('express');
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const session = require('express-session');

const server = express();

//Configure the server
server.use(bodyparser.urlencoded({ extended: false }));
server.use(session({
    secret: '98rncailevn-_DT83FZ@', // TODO: LUKE DONT FORGET
    resave: false,
    saveUninitialized: true
}));

server.engine('mustache', mustache());
server.set('views', './views')
server.set('view engine', 'mustache');


//Set up some routes



// THIS IS NEW AND VERY IMPORTANT
// request.session is an object where we can put information
// that only applies to this session.



// 1. is the username real?
// 2. if so, does the password match?



// Run the server
