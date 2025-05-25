const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
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
  if (book) {
    return res.send(JSON.stringify(book, null, 4)); // Pretty-printed JSON
  } else {
    return res.status(404).send("Book not found");
  }
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let book = Object.values(books)
      .filter(book =>
          book.author === author);
  if (book) {
    return res.send(JSON.stringify(book, null, 4)); // Pretty-printed JSON
  } else {
    return res.status(404).send("Book not found");
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title  = req.params.title;
  if (title) {
    let book = Object.values(books)
        .filter(book => book.title === title);
    if (book) {
      return res.send(JSON.stringify(book));
    } else {
      return res.status(404).send("Book not found");
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
    if (book) {
      return res.send(book[0].reviews);
    } else {
      return res.status(404).send("Book not found");
    }
  } else {
    return res.status(400).json({message: "isbn can not be null"});
  }
});

module.exports.general = public_users;
