//express
const express = require("express");
const app = express();

//port
const PORT = 8080;

//ejs
app.set("view engine", "ejs");

//body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

//helper functions
const { generateRandomString, urlsForUser, getUserByEmail } = require("./helpers")

//password hasher
const bcrypt = require('bcryptjs');
const saltRounds = 10;

//cookie session
const cookieSession = require('cookie-session');
const { redirect } = require("express/lib/response");
app.use(cookieSession({
  name: 'session',
  keys: ['boogaloo']
}));

//database with id
const urlDatabase = {
  b6UTxQ: {
    longURL: "http://www.lighthouselabs.ca",
    userId: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userId: "aJ48lW"
  }
};

//check if user currently logged in
//n id coming in url
//check if user in url is sa,e as url database

//user database
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
};

//GET


//login form
app.get("/login", (req, res) => {
  const userId = req.session['userId'];
  res.render('urls_login', { user: usersDatabase[userId] })
});

//register form
app.get("/register", (req, res) => {
  const userId = req.session['userId'];
  res.render('urls_registration', { user: usersDatabase[userId] });
})

//main page
app.get("/urls", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.redirect("/login");
  } else {
const templateVars = { urls: urlsForUser(userId), user: usersDatabase[userId] };
  res.render("urls_index", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

//new URLS
app.get("/urls/new", (req, res) => {
  const userId = req.session.userId;
  if (req.session['userId']) {
    const templateVars = { user: usersDatabase[userId] };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login")
  }
});

//edit
app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  longURL = urlDatabase[shortURL].longURL
  const userId = req.session['userId'];
  const templateVars = { shortURL: shortURL, longURL: longURL, user: usersDatabase[userId] }
  res.render("urls_show", templateVars);

});


//POST


//create new id and store registration infos
app.post("/register", (req, res) => {
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

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {

      const userId = generateRandomString();

      const newUser = {
        id: userId,
        email,
        password: hash
      }
      usersDatabase[userId] = newUser;

      req.session['userId'] = userId
      res.redirect('/urls')
    })
  })
});

app.post("/urls/:shortURL/", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL].longURL = req.body.longUrl;
  res.redirect("/urls")
});

//delete url
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  for (const index of urlDatabase) {
    if(urlDatabase[index].userId === req.session.userId) {
        delete urlDatabase[shortURL].longURL;
    }
  }
  res.redirect("/urls")
});

//generate short url and add to database
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const newUrl = { longURL: req.body.longURL }
  urlDatabase[shortURL] = newUrl
  console.log(req.body.longURL)
  // res.redirect(`/urls/${shortURL}`)
res.redirect("/login")

});

//authentication 
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  for (let userId in usersDatabase) {
    const user = usersDatabase[userId];

    if (user.email === email && bcrypt.compareSync(password, user.password)) {
      req.session['userId'] = user.id
      res.redirect('/urls');
      return
    }
  }
  res.status(400).send('email or password is incorrect. Please try again.')
});


//logout
app.post("/logout", (req, res) => {
  req.session.userId = null
  res.redirect('/login');
});

//Allows server to retreieve or "listen" for requests
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//TEMP
app.get('/users.json', (req, res) => {
  res.json(usersDatabase);
})