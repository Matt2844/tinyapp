// 1. from the header when changing the login and logout style

// <!-- <form action="/logout" method="POST">
// <span>Logged in as: <%= user.email %></span>
// <button type="submit">Logout</button>
// </form> -->
// <!-- <% } else { %> -->
// <form action="/login" method="POST">
// <input type="text" name="username" placeholder="Enter Username" />
// <button type="submit">Login</button>
// </form>
// <!-- <% } %> -->

// 2. Bunch of stuff from the express_server.js

// // The login, if user is logged in
// app.get('/logout', (req, res) => {
//   res.render('/logout');
// });

// // The login in nav bar
// app.get('/login', (req, res) => {
//   res.render('login')
// })

// Attaching a cookie to login user
// app.post('/login', (req, res) => {
//   let username = req.body.username
//   res.cookie("user_id", username).redirect('/urls')
// });

// // The login, if user is logged out
// app.post('/logout', (req, res) => {
//   res.clearCookie("user_id");
//   res.redirect('/urls');
// });