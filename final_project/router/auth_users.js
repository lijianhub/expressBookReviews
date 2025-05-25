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

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization?.username;
  const isbn = req.params.isbn;
  const review = req.body.review;

  if (!isbn) {
    return res.status(400).json({ message: "ISBN cannot be null" });
  }
  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }
  // Find the book by ISBN
  const book = Object.values(books).find(book => book.isbn === isbn);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const reviews = book.reviews;
  if (reviews[username]) {
    if (reviews[username] !== review) {
      reviews[username] = review;
      return res.send(`Book ISBN: ${isbn} review has been modified.`);
    } else {
      return res.send(`Book ISBN: ${isbn} review is unchanged.`);
    }
  } else {
    reviews[username] = review;
    return res.send(`Book ISBN: ${isbn} review has been added.`);
  }
});

//Delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization?.username;
  const isbn = req.params.isbn;

  if (!isbn) {
    return res.status(400).json({ message: "ISBN cannot be null" });
  }

  // Find the book by matching ISBN
  const book = Object.values(books).find(book => book.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has a review
  if (book.reviews.hasOwnProperty(username)) {
    delete book.reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Review by user not found" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
