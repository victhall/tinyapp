const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//express.get takes in 2 params (request, response)
//When client is connected, they receieve "hello" on their end.
app.get("/", (req, res) => {
  res.send("Hello!");
});

//Incorporates JS and HTML.
//Responds with bolded text
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//Allows server to retreieve or "listen" to requests
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});