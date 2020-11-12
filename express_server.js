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
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "abc321" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "abc321" },
  i3Babc: { longURL: "https://www.youtube.com", userID: "xyz321" }
};

const userDatabase = {
  "abc321": {
    id: "abc321",
    email: "example@gmail.com",
    password: "123456",
  },
  "xyz321": {
    id: "xyz321",
    email: "exampletwo@gmail.com",
    password: "123",
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

const bcrypt = require('bcrypt');
const saltRounds = 10;


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

// List of URLs page
app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"]
  const userLoggedIn = req.cookies["user_login"]
  const templateVars = {
    urls: urlDatabase,
    user: userDatabase[userId], allUsers: userDatabase,
    userLogin: userLoggedIn,

  }
  res.render("urls_index", templateVars);
});

// To access register page from nav bar
app.get('/urls/register', (req, res) => {
  const userId = req.cookies["user_id"]
  const userLoggedIn = req.cookies["user_login"]
  const templateVars = {
    user: userDatabase[userId], allUsers: userDatabase,
    userLogin: userLoggedIn
  }
  res.render('urls_register', templateVars);
})

// To access tinyApp page from nav bar
app.get("/urls/tinyApp", (req, res) => {
  const userId = req.cookies["user_id"]
  const userLoggedIn = req.cookies["user_login"]
  const templateVars = {
    user: userDatabase[userId], allUsers: userDatabase,
    userLogin: userLoggedIn,
  }
  res.render("urls_show", templateVars);
});

// To access create a new url page from nav bar
app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"]
  const userLoggedIn = req.cookies["user_login"]
  const templateVars = {
    user: userDatabase[userId], allUsers: userDatabase,
    userLogin: userLoggedIn
  }
  res.render("urls_new", templateVars);
});

// To access login page from nav bar
app.get('/urls/login', (req, res) => {
  const userId = req.cookies["user_id"]
  const userLoggedIn = req.cookies["user_login"]
  const templateVars = {
    user: userDatabase[userId], allUsers: userDatabase,
    userLogin: userLoggedIn
  }
  res.render('urls_login', templateVars);
})

// To access logout page from nav bar when logged in
app.get('/urls/logout', (req, res) => {
  const userId = req.cookies["user_id"]
  const userLoggedIn = req.cookies["user_login"]
  const templateVars = {
    user: userDatabase[userId], allUsers: userDatabase,
    userLogin: userLoggedIn
  }
  res.render('urls_logout', templateVars);
})

// Step 1/2 generates the short url
app.get("/urls/:shortURL", (req, res) => {
  const userId = req.cookies["user_id"]
  const userLoggedIn = req.cookies["user_login"]
  const templateVars = {
    user: userDatabase[userId], allUsers: userDatabase,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    userLogin: userLoggedIn
  }
  res.render("urls_show", templateVars);
});

// Step 2/2 generates the short url
app.post("/urls", (req, res) => {
  const randomID = generateRandomString();
  urlDatabase[randomID] = {
    longURL: req.body.longURL,
    userID: req.cookies["user_id"]
  }
  console.log(urlDatabase);
  res.status(200);
  res.redirect("/urls")
});

// Delete a url from the url list
app.post('/urls/:shortURL/delete', (req, res) => {

  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.post('/urls/:id', (req, res) => {
  res.redirect('/urls')
})

// REGISTER

// To add users id, email, password to database
app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

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
  const email = req.body.email;
  const password = req.body.email;
  const hashedPassword = bcrypt.hashSync(password, 10);

  // If login is left blank
  if (email === "" || password === "") {
    return res.status(400).send('Please fill out login with your email and password.');
  }
  // If password or email does not match userDatabase
  const userEmailPassword = (userDatabase) => {
    const userVals = Object.values(userDatabase);
    for (let i = 0; i < userVals.length; i++) {
      if (email === userVals[i].email && bcrypt.compareSync(password, hashedPassword)) {
        return userVals[i].id;
      }
    }
    return false;
  };
  const userID = userEmailPassword(userDatabase)
  if (userID) {
    res.cookie("user_id", userID);
    res.redirect('/urls');
  } else {
    res.status(400).send('Username or password does not exist.')
  }
});


// Handler for the logout page
app.post('/logout', (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls")
});


// password === userVals[i].password)