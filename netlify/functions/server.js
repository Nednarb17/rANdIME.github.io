// /netlify/functions/server.js
const express = require('express');
const app = express();
const path = require('path');



app.use(express.static(path.join(__dirname, 'public'))); // Static files

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index');
});

const server = app.listen(3000, () => {
  console.log('Serverless Express app is running');
});

module.exports.handler = (event, context, callback) => {
  return server(event, context, callback);
};
