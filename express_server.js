// express_server.js

const { request } = require("express");

// Setting up a server

const express = require("express");
const app = express();
const PORT = 3000;

const generateRandomString = () => {
  return Math.random().toString(36).substring(6);
};

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const userDatabase = {
  "Matt": {
    id: "abc321",
    email: "example@gmail.com",
    password: "123456",
  },
};

// Helper function, returns list of emails in userDatabase
const emailsInDatabase = (userDatabase) => {
  const userVals = Object.values(userDatabase);
  for (let i = 0; i < userVals.length; i++) {
    return userVals[i].email;
  }
};

// Array of user emails, updates with new entries
const emailDatabase = ["example@gmail.com"]

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

const randomId = generateRandomString()

// Home page
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"]
  const userLoggedIn = req.cookies["user_login"]
  const templateVars = {
    urls: urlDatabase,
    user: userDatabase[userId],
    userLogin: userLoggedIn,

  }
  res.render("urls_index", templateVars);
});

// To access register page from nav bar
app.get('/urls/register', (req, res) => {
  const userId = req.cookies["user_id"]
  const userLoggedIn = req.cookies["user_login"]
  const templateVars = {
    user: userDatabase[userId],
    userLogin: userLoggedIn
  }
  res.render('urls_register', templateVars);
})

// To access tinyApp page from nav bar
app.get("/urls/tinyApp", (req, res) => {
  const userId = req.cookies["user_id"]
  const userLoggedIn = req.cookies["user_login"]
  const templateVars = {
    user: userDatabase[userId],
    userLogin: userLoggedIn,
  }
  res.render("urls_show", templateVars);
});

// To access create a new url page from nav bar
app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"]
  const userLoggedIn = req.cookies["user_login"]
  const templateVars = {
    user: userDatabase[userId],
    userLogin: userLoggedIn
  }
  res.render("urls_new", templateVars);
});

// To access login page from nav bar
app.get('/urls/login', (req, res) => {
  const userId = req.cookies["user_id"]
  const userLoggedIn = req.cookies["user_login"]
  const templateVars = {
    user: userDatabase[userId],
    userLogin: userLoggedIn
  }
  res.render('urls_login', templateVars);
})

// To access logout page from nav bar when logged in
app.get('/urls/logout', (req, res) => {
  const userId = req.cookies["user_id"]
  const userLoggedIn = req.cookies["user_login"]
  const templateVars = {
    user: userDatabase[userId],
    userLogin: userLoggedIn
  }
  res.render('urls_logout', templateVars);
})

// Step 1/2 generates the short url
app.get("/urls/:shortURL", (req, res) => {
  const userId = req.cookies["user_id"]
  const userLoggedIn = req.cookies["user_login"]
  const templateVars = {
    user: userDatabase[userId],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    userLogin: userLoggedIn
  }
  res.render("urls_show", templateVars);
});

// Step 2/2 generates the short url
app.post("/urls", (req, res) => {
  urlDatabase[randomId] = req.body.longURL
  console.log(urlDatabase);
  res.status(200);
  res.redirect("/urls")
});

// Delete a url from the url list
app.post('/urls/:shortURL/delete', (req, res) => {
  console.log(req.params.shortURL);
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.post('/urls/:id', (req, res) => {
  res.redirect('/urls')
})

// To add users id, email, password to database
app.post('/register', (req, res) => {
  const { email, password } = req.body
  if (email === "" || password === "") {
    return res.status(400).send('Registration error. Please make sure to fill in email and password.');
  }
  for (let existingEmail of emailDatabase) {
    if (email === existingEmail) {
      return res.status(400).send('Sorry that email is already in use.')
    }
  }
  const newUser = {
    id: generateRandomString(),
    email: req.body.email,
    password: req.body.password,
  }
  userDatabase[newUser.id] = newUser;
  emailDatabase.push(email);
  console.log(emailsInDatabase(userDatabase));
  res.cookie("user_id", newUser.id).redirect('/urls')
});






// LOGIN

// Handler for the login page 
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  // If login is left blank
  if (email === "" || password === "") {
    return res.status(400).send('Please fill out login with your email and password.');
  }
  // If password or email does not match userDatabase
  const userEmailPassword = (userDatabase) => {
    const userVals = Object.values(userDatabase);
    for (let i = 0; i < userVals.length; i++) {
      if (email !== userVals[i].email) {
        return res.status(400).send('Username or password does not exist.')
      } else if (password != userVals[i].password) {
        return res.status(400).send('Username or password does not exist.')
      }
    }
  };
  userEmailPassword(userDatabase);
  // Attach a cookie
  const loginCookieVal = generateRandomString()
  res.cookie("user_login", loginCookieVal).redirect('/urls')
});





// Handler for the logout page
app.post('/logout', (req, res) => {
  res.clearCookie("user_id");
  res.clearCookie("user_login");
  res.redirect("/urls")
});


