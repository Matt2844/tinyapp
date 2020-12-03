// express_server.js

// Environment setup such as dependencies, libraries, and/or imports. 

const { request } = require("express");
const { emailsInDatabase } = require('./helpers');
const { getUserByEmail } = require("./helpers");

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require("express");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())


// The sophisticated databases

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

const emailDatabase = ["example@gmail.com"]

// Global variables or functions
const generateRandomString = () => {
  return Math.random().toString(36).substring(6);
};

// Reminder that port is set to 3000
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);

});

app.get("/users.json", (req, res) => {
  res.json(userDatabase);
});

// "My URLs" page
app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  const userLoggedIn = req.cookies["user_login"];
  const templateVars = {
    urls: urlDatabase,
    user: userDatabase[userId], allUsers: userDatabase,
    userLogin: userLoggedIn,

  }
  res.render("urls_index", templateVars);
});

// --- "Register" Page ---
app.get('/register', (req, res) => {
  const userId = req.cookies["user_id"];
  const userLoggedIn = req.cookies["user_login"];
  const templateVars = {
    user: userDatabase[userId], allUsers: userDatabase,
    userLogin: userLoggedIn
  }

  res.render('urls_register', templateVars);
});

// --- "Create New URL" Page ---
app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"];
  const userLoggedIn = req.cookies["user_login"];
  const templateVars = {
    user: userDatabase[userId], allUsers: userDatabase,
    userLogin: userLoggedIn
  }

  res.render("urls_new", templateVars);
});

// --- "Login" Page --- (when user is logged out)
app.get('/login', (req, res) => {
  const userId = req.cookies["user_id"];
  const userLoggedIn = req.cookies["user_login"];
  const templateVars = {
    user: userDatabase[userId], allUsers: userDatabase,
    userLogin: userLoggedIn
  }

  res.render('urls_login', templateVars);
});

// --- "Logout" Page --- (when user is logged in)
app.get('/logout', (req, res) => {
  const userId = req.cookies["user_id"]
  const userLoggedIn = req.cookies["user_login"]
  const templateVars = {
    user: userDatabase[userId], allUsers: userDatabase,
    userLogin: userLoggedIn
  }

  res.render('urls_logout', templateVars);
})

// Gets the short url
app.get("/urls/:shortURL", (req, res) => {
  const userId = req.cookies["user_id"];
  const userLoggedIn = req.cookies["user_login"];
  const templateVars = {
    user: userDatabase[userId], allUsers: userDatabase,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    userLogin: userLoggedIn
  }
  if (userId === urlDatabase[req.params.shortURL].userID) {
    res.render("urls_show", templateVars);
  } else {
    res.status(400).send('Sorry you do not own this url.')
  }


});

// Redirect the short url to long url
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.send('Sorry the short url does not exist.')
  }
});

// Gets the short url continued
app.post("/urls", (req, res) => {
  const randomID = generateRandomString();

  urlDatabase[randomID] = {
    longURL: req.body.longURL,
    userID: req.cookies["user_id"]
  }

  res.status(200);
  res.redirect("/urls");
});

// Delete a url from the "My URLs" page
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

// Redirect after url is deleted
app.post('/urls/:id', (req, res) => {
  const newLongURL = req.body.longURL;
  const shortURL = req.params.id;
  urlDatabase[shortURL].longURL = newLongURL;
  res.redirect('/urls');
})

// --- Register Page --- (when a user tries to register)
app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  // If input is submitted blank by user
  if (email === "" || password === "") {
    return res.status(400).send('Registration error. Please make sure to fill in email and password.');
  }

  // If email already exits
  for (let existingEmail of emailDatabase) {
    if (email === existingEmail) {
      return res.status(400).send('Sorry that email is already in use.');
    }
  }

  // Adding new user to the database, and setting cookie
  const newUser = {
    id: generateRandomString(),
    email: req.body.email,
    password: hashedPassword,
  }

  userDatabase[newUser.id] = newUser;
  emailDatabase.push(email);
  console.log(newUser);
  res.cookie("user_id", newUser.id).redirect('/urls');
});

// --- Login Page --- (when user hits submit button)
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // If login is left blank
  if (email === "" || password === "") {
    return res.status(400).send('Please fill out login with your email and password.');
  }

  // If password or email does, or does not match userDatabase
  const userEmailPassword = (userDatabase) => {
    const userVals = Object.values(userDatabase);

    for (let i = 0; i < userVals.length; i++) {
      console.log(email, userVals[i].email);
      if (email === userVals[i].email) {
        const hash = userVals[i].password;
        const isMatch = bcrypt.compareSync(password, hash);

        if (isMatch) {
          const userID = userVals[i].id;
          res.cookie("user_id", userID);
          return res.redirect('/urls');
        }
      }
    }
    res.status(400).send('Username or password does not exist')
  };

  const userID = userEmailPassword(userDatabase);

});

// Clears cookie when user logs out
app.post('/logout', (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});
