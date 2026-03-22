const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Fake database
const users = [
  { email: 'admin@example.com', password: 'password123' },
  { email: 'user@example.com', password: 'userpass123' }
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;
  console.log('Executed query:', query);
  let loggedIn = false;
  let loginUser = null;

  if (query.includes("' OR '1'='1")) {
    loggedIn = true;
    loginUser = 'admin';
  } else {
    if (!email || !password) {
      res.send('<h2>Login Failed</h2><p>Error: All fields are required.</p><a href="/">Try again</a>');
      return;
    }

    if (!email.includes('@')) {
      res.send('<h2>Login Failed</h2><p>Error: Invalid email format (must contain @).</p><a href="/">Try again</a>');
      return;
    }

    if (password.length < 8) {
      res.send('<h2>Login Failed</h2><p>Error: Password must be at least 8 characters long.</p><a href="/">Try again</a>');
      return;
    }

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      loggedIn = true;
      loginUser = email;
    }
  }

  if (loggedIn) {
    res.send('<h2>Login Successful!</h2><p>Welcome, ' + loginUser + '! You are now logged in as ' + loginUser + '</p><a href="/">Logout</a>');
  } else {
    res.send('<h2>Login Failed</h2><p>Error: Invalid email or password combination.</p><a href="/">Try again</a>');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});