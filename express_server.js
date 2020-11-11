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

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

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

app.get("/urls/tinyApp", (req, res) => {
  res.render("urls_show");
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["login_cookie"],
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls/new", (req, res) => {
  res.redirect("/urls")
  const randomId = generateRandomString()
  urlDatabase[randomId] = req.body.longURL
  console.log(urlDatabase);
  res.status(200);

});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
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

// The login in nav bar
app.get('/login', (req, res) => {
  res.render('login')
})
// Attaching a cookie to login user
app.post('/login', (req, res) => {
  let username = req.body.username
  console.log(username);
  res.cookie("login_cookie", username).redirect('/urls')
});

// The login, if user is logged in
app.get('/logout', (req, res) => {
  res.render('/logout');
});

app.post('/logout', (req, res) => {
  res.clearCookie("login_cookie");
  res.redirect('/urls');
}); 