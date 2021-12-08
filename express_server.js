const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

//tells Express app to use ejs as template engine
app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

//Random string generator
const generateRandomString = function () {
  let newStr = Math.random().toString(36).slice(2, 8);
  return newStr;
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
  const username = req.cookies['username'];
  const templateVars = { urls: urlDatabase, username: username };
  res.render("urls_index", templateVars);
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get("/urls/new", (req, res) => {
    const username = req.cookies['user_name'];
    const templateVars = { username: username };
    res.render("urls_new", templateVars);
  });

app.get('/urls/:shortURL', (req, res)=>{
  const shortURL = req.params.shortURL;
  longURL = urlDatabase[shortURL]
  const username = req.cookies['user_name'];
  const templateVars = { shortURL: shortURL, longURL: longURL, username: username };
  res.render("urls_show", templateVars);
})

app.post("/urls", (req, res) => {
  const randomStr = generateRandomString();
  urlDatabase[randomStr] = req.body.longURL;
  res.redirect(`/urls/${randomStr}`)
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls")
});

app.post("/urls/:shortURL/", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longUrl;
  res.redirect("/urls")
});

// app.get('/login', (req, res) => {
//   res.cookie('username', req.body.username);
//   res.redirect('login');
// });

app.post("/login", (req, res) => {
res.cookie('username', req.body.username);
res.redirect('/urls')
});

app.post("/logout", (req,res)=>{
  res.clearCookie('username')
  res.redirect('/urls');
})

//Allows server to retreieve or "listen" for requests
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});