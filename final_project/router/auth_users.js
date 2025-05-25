const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let usersWithSameName = users.filter(user => user.username === username);
  return (usersWithSameName.length > 0);
}

const authenticatedUser = (username, password)=>{ //returns boolean
  let userList = users.filter(user => user.username === username && user.password === password);
  return (userList.length > 0);
}

//only registered users can log in
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(403).json({message: "The username and password can not be null!"});
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json({message: "User successfully logged in."});
  } else {
    return res.status(403).json({message: "Invalid Login. Check username and password"});
  }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
