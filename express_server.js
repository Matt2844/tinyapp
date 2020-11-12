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
  const templateVars = {
    urls: urlDatabase,
    user: userDatabase[userId],
  }
  res.render("urls_index", templateVars);
});

// To access register page from nav bar
app.get('/urls/register', (req, res) => {
  const userId = req.cookies["user_id"]
  const templateVars = {
    user: userDatabase[userId],
  }
  res.render('urls_register', templateVars);
})

// To access tinyApp page from nav bar
app.get("/urls/tinyApp", (req, res) => {
  const userId = req.cookies["user_id"]
  const templateVars = {
    user: userDatabase[userId],
  }
  res.render("urls_show", templateVars);
});

// To access create a new url page from nav bar
app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"]
  const templateVars = {
    user: userDatabase[userId],
  }
  res.render("urls_new", templateVars);
});

// Generates the short url
app.post("/urls/new", (req, res) => {
  res.redirect("/urls")
  urlDatabase[randomId] = req.body.longURL
  console.log(urlDatabase);
  res.status(200);

});

app.get("/urls/:shortURL", (req, res) => {
  const userId = req.cookies["user_id"]
  const templateVars = {
    user: userDatabase[userId],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  }
  res.render("urls_show", templateVars);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  console.log(req.params.shortURL);
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.post('/urls/:id', (req, res) => {
  res.redirect('/urls')
})

// The login, if user is logged in
app.get('/logout', (req, res) => {
  res.render('/logout');
});

// The login in nav bar
app.get('/login', (req, res) => {
  res.render('login')
})

// Attaching a cookie to login user
app.post('/login', (req, res) => {
  let username = req.body.username
  res.cookie("user_id", username).redirect('/urls')
});



// The login, if user is logged out
app.post('/logout', (req, res) => {
  res.clearCookie("user_id");
  res.redirect('/urls');
});

// To add users id, email, password to database
app.post('/register', (req, res) => {
  console.log(req.body);
  const newUser = {
    id: generateRandomString(),
    email: req.body.email,
    password: req.body.password,
  }
  userDatabase[newUser.id] = newUser;
  console.log(newUser);

  res.cookie("user_id", newUser.id).redirect('/urls')
});
