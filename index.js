const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const userFilePath = path.join(__dirname, 'user.json');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

/*
- Create new html file name home.html 
- add <h1> tag with message "Welcome to ExpressJs Tutorial"
- Return home.html page to client
*/
router.get('/home', (req,res) => {
  // return home.html page 
  res.sendFile(path.join(__dirname, 'home.html')); 
});

/*
- Return all details from user.json file to client as JSON format
*/
router.get('/profile', (req,res) => {
  fs.readFile(userFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading user data' });
    } 
    const users = JSON.parse(data);
    res.json(users);
  });
});

/*
- Modify /login router to accept username and password as JSON body parameter
- Read data from user.json file
- If username and  passsword is valid then send resonse as below 
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid then send response as below 
    {
        status: false,
        message: "User Name is invalid"
    }
- If passsword is invalid then send response as below 
    {
        status: false,
        message: "Password is invalid"
    }
*/
router.post('/login', (req,res) => {
  const { username, password } = req.body;
  fs.readFile(userFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading user data' });
    }
    const user = JSON.parse(data);
    if (user.username !== username) {
      return res.status(401).json({ status: false, message: "User Name is invalid" });
    }
    if (user.password !== password) {
      return res.status(401).json({ status: false, message: "Password is invalid" });
    }
    return res.json({ status: true, message: "User Is valid" });
  });
});

/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logout.<b>
*/
router.get('/logout', (req,res) => {
  const username = req.query.username;
  res.send(`<h1>${username} successfully logged out.</h1>`);
});

/*
Add error handling middleware to handle below error
- Return 500 page with message "Server Error"
*/
app.use((err,req,res,next) => {
  console.error(err.stack);
  res.status(500).send('Server Error')
});

app.use('/', router);

app.listen(process.env.port || 8081);

console.log('Web Server is listening at port '+ (process.env.port || 8081));