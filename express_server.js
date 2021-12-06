const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

//tells Express app to use ejs as template engine
app.set("view engine", "ejs");


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

//When client requests /urls, the server responds with templateVars.
//.render takes 2 params (file/path, variable)
//urls_index.ejs is a template file
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase };
  res.render("urls_show", templateVars);
});

//Allows server to retreieve or "listen" for requests
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});