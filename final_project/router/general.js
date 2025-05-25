const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(403).send("Username and password can not be null!");
  }
  if (isValid(username)) {
    return res.status(403).send("User already exists!");
  }
  users.push({"username":username, "password":password});
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, "", 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = Object.values(books)
      .filter(book =>
    book.isbn === isbn);
  if (book && book.length > 0) {
    return res.send(JSON.stringify(book, null, 4)); // Pretty-printed JSON
  } else {
    return res.status(404).send("Book is not found");
  }
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let book = Object.values(books)
      .filter(book =>
          book.author === author);
  if (book && book.length > 0) {
    return res.send(JSON.stringify(book, null, 4)); // Pretty-printed JSON
  } else {
    return res.status(404).send("Book is not found");
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title  = req.params.title;
  if (title) {
    let book = Object.values(books)
        .filter(book => book.title === title);
    if (book && book.length > 0) {
      return res.send(JSON.stringify(book));
    } else {
      return res.status(404).send("Book is not found");
    }
  } else {
    return res.status(400).json({message: "isbn can not be null"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if (isbn) {
    let book = Object.values(books)
        .filter(book => book.isbn === isbn);
    if (book && book.length > 0) {
      return res.send(book[0].reviews);
    } else {
      return res.status(404).send("Book is not found");
    }
  } else {
    return res.status(400).json({message: "isbn can not be null"});
  }
});

module.exports.general = public_users;
