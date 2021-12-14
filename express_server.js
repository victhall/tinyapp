//express
const express = require('express');
const app = express();

//port
const PORT = 8080;

//ejs
app.set('view engine', 'ejs');

//body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//helper functions
const { generateRandomString, urlsForUser, getUserByEmail } = require('./helpers')

//password hasher
const bcrypt = require('bcryptjs');

//cookie session
const cookieSession = require('cookie-session');
const { redirect } = require('express/lib/response');
app.use(cookieSession({
  name: 'session',
  keys: ['boogaloo']
}));

//database with id
const urlDatabase = {
  b6UTxQ: {
    longURL: 'http://www.lighthouselabs.ca',
    userId: 'aJ48lW'
  },
  i3BoGr: {
    longURL: 'https://www.google.ca',
    userId: 'aJ48lW'
  }
};

//user database
const usersDatabase = {
  'userRandomID': {
    id: 'userRandomID',
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur'
  },
  'user2RandomID': {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: 'dishwasher-funk'
  }
};

//GET


//main page
app.get('/', (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.redirect('/login')
  }
  res.redirect('/urls');
});

//login form
app.get('/login', (req, res) => {
  const userId = req.session['userId'];
  res.render('urls_login', { user: usersDatabase[userId] })
});

//register form
app.get('/register', (req, res) => {
  const userId = req.session['userId'];
  if (!userId) {
    res.render('urls_registration', { user: usersDatabase[userId] });
  }
  res.redirect('/urls');
})

//urls page
app.get('/urls', (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(400).send('Please register or log in to access Tiny app Urls')
  } else {
    const templateVars = { urls: urlsForUser(userId, urlDatabase), user: usersDatabase[userId] };
    res.render('urls_index', templateVars);
  }
});

app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    return res.status(400).send('The link you are looking for does not exist.');
  }
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

//new URLS
app.get('/urls/new', (req, res) => {
  const userId = req.session.userId;
  if (req.session['userId']) {
    const templateVars = { user: usersDatabase[userId] };
    res.render('urls_new', templateVars);
  } else {
    res.redirect('/login')
  }
});

//edit
app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const userId = req.session['userId'];
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = { shortURL: shortURL, longURL: longURL, user: usersDatabase[userId] }
  if (!urlDatabase[shortURL]) {
    return res.status(400).send('The link you are looking for does not exist.');
  }
  else if (userId !== urlDatabase[shortURL].userId) {
    return res.status(400).send('You do not have access to this Tinyapp Url');
  }
  else if (!userId) {
    return res.status(400).send('Please register for an account or log in to access Tinyapp');
  } else {
    res.render('urls_show', templateVars);

  }
});


//POST


//create new id and store registration infos
app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  for (const userId in usersDatabase) {
    const user = usersDatabase[userId];
    if (getUserByEmail(email, usersDatabase)) {
      res.status(403).send('Sorry, user already exists.');
      return;
    }
    if (!password || !email) {
      res.status(400).send('Enter a valid email or password');
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
      req.session['userId'] = userId;
      res.redirect('/urls');
    })
  })
});

app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session.userId;
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    user: userID
  }

  if (userID && userID === urlDatabase[shortURL].user) {
    urlDatabase[shortURL].longURL = req.body.longUrl;
    res.redirect(`/urls/${shortURL}`);
  }
  res.status(400).send('Please register/log in to use TinyApp.');
});

//delete url
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL]) {
    delete urlDatabase[shortURL];
  }
  res.redirect('/urls');
});

//generate short url and add to database
app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  const newUrl = { longURL: req.body.longURL, userId: req.session.userId }
  urlDatabase[shortURL] = newUrl;
  res.redirect(`/urls/${shortURL}`);
});

//authentication 
app.post('/login', (req, res) => {
  const password = req.body.password;
  const user = getUserByEmail(req.body.email, usersDatabase);

  if (!user) {
    res.status(400).send('This user does not exist.');
    return;
  }
  if (user && bcrypt.compareSync(password, user.password)) {
    req.session['userId'] = user.id;
    res.redirect('/urls');
    return;
  }
  res.status(400).send('email or password is incorrect. Please try again.')
});

//logout
app.post('/logout', (req, res) => {
  res.clearCookie('session');
  res.clearCookie('session.sig');
  res.redirect('/login');
});

//Allows server to retrieve requests
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});