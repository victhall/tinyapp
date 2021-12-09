const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

//tells Express app to use ejs as template engine
app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const usersDatabase = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

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

//When client requests /urls, the server responds with templateVars.
//.render takes 2 params (file/path, variable)
//urls_index.ejs is a template file
app.get("/urls", (req, res) => {
  const userId = req.cookies['userId'];
  const templateVars = { urls: urlDatabase, user: usersDatabase[userId] };
  res.render("urls_index", templateVars);
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userId = req.cookies['userId'];
  const templateVars = { user: usersDatabase[userId] }
  res.render("urls_new", templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  longURL = urlDatabase[shortURL]
  const userId = req.cookies['userId'];
  const templateVars = { shortURL: shortURL, longURL: longURL, user: usersDatabase[userId] }
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

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    for (let userId in usersDatabase) {
      const user = usersDatabase[userId];
  
      if (user.email === email && user.password === password) {
        res.cookie('userId', user.id);
        res.redirect('/urls');
        return
      }
    }
    res.status(400).send('email or password is incorrect. Please try again.')
  });

  app.get("/login", (req, res) => {
      const userId = req.cookies['userId'];
      res.render('urls_login', { user: usersDatabase[userId] })
    });

app.post("/logout", (req, res) => {
  res.clearCookie('userId')
  res.redirect('/urls');
});

app.get("/register", (req, res) => {
  const userId = req.cookies['userId'];
  res.render('urls_registration', { user: usersDatabase[userId] });
})
//TEMP
app.get('/users.json', (req, res) => {
  res.json(usersDatabase);
})

app.post("/register", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  for (const userId in usersDatabase) {
    const user = usersDatabase[userId];

    if (user.email === email) {
      res.status(400).send('Sorry, user already exists.');
      return
    }
    if (!password || !email) {
      res.status(400).send('Enter a valid email or password')
    }
  }

  const userId = Math.random().toString(36).slice(2, 8);

  const newUser = {
    id: userId,
    name: name,
    email: email,
    password: password
  };

  usersDatabase[userId] = newUser;

  res.cookie('userId', userId)
  res.redirect('/urls')
});

//Allows server to retreieve or "listen" for requests
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});