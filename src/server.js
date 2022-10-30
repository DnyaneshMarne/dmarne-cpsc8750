// use the express library
const express = require('express');
const fetch = require('node-fetch');
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

//shuffle
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

app.get("/trivia", async (req, res) => {
  // fetch the data
  const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");

  // fail if bad response
  if (!response.ok) {
    res.status(500);
    res.send(`Open Trivia Database failed with HTTP code ${response.status}`);
    return;
  }

  // interpret the body as json
  const content = await response.json();

  // fail if db failed
  /*if (response.data !== 0) {
    res.status(500);
    res.send(`Open Trivia Database failed with internal response code ${response.data}`);
    return;
  }*/
  // respond to the browser
  // TODO: make proper html
  //res.send(JSON.stringify(content, 2));
  const ans = content['results'][0]['incorrect_answers']
  ans.push(content['results'][0]['correct_answer'])

  const correctAnswer = content['results'][0]['correct_answer'];
  shuffle(ans);
  const answerLinks = ans.map(answer => {
    return `<a href="javascript:alert('${
      answer === correctAnswer ? 'Correct!' : 'Incorrect, Please Try Again!'
      }')">${ answer }</a>`
  })


  dataToPass = {'question':content['results'][0]['question'],
                'answers': answerLinks,
                'category':content['results'][0]['category'],
                'difficulty':content['results'][0]['difficulty']}
  //console.log(dataToPass);

  res.render('trivia', dataToPass);
});
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
  },
  //console.log(req.cookies)
  );
});

// Start listening for network connections
app.listen(port);

// Printout for readability
//console.log("Server Started!");