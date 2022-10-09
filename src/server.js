// use the express library
const express = require('express');
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
// create a new server application
const app = express();
app.use(cookieParser());
// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
app.use(express.static('public'));
//const {encode} = require('html-entities');
app.set('view engine', 'ejs');
// ... snipped out code ...
let nextVisitorId = 1;
app.get('/', (req, res) => {
  res.cookie('visitorId', nextVisitorId++);
  res.cookie('visited', Date.now().toString());
  res.render('welcome', {
    name: req.query.name || "World",
    time: new Date().toLocaleString(),
    visiterID: req.cookies['visitorId'],
    diff: ((new Date() - req.cookies['visited'])/1000).toLocaleString(),
  },console.log(req.cookies));
});

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");