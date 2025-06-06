const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');
const {response} = require("express");

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

// Using Promise callbacks
function getBooksUsingPromise() {
  axios.get('http://localhost:5000')
      .then(response => {
        //console.log('Books using Promise:', response.data);
      })
      .catch(error => {
        console.error('Error fetching books using Promise:', error);
      });
}

// Using async-await
async function getBooksUsingAsyncAwait() {
  try {
    const response = await axios.get('http://localhost:5000');
    return response.data; // Return the data
  } catch (error) {
    console.error('Error fetching books using async-await:', error);
    throw error; // Re-throw if you want to handle it outside
  }
}

//getBooksUsingPromise();

getBooksUsingAsyncAwait()
    .then(data => {})
    .catch(err => console.error('Caught error:', err));

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


// Using Promise callbacks
function getBookByISBNUsingPromise(isbn) {
  axios.get(`http://localhost:5000/isbn/${isbn}`)
      .then(response => {
        console.log('Book details using Promise:', response.data);
      })
      .catch(error => {
        console.error('Error fetching book details using Promise:', error);
      });
}

// Using async-await
async function getBookByISBNUsingAsyncAwait(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log('Book details using async-await:', response.data);
  } catch (error) {
    console.error('Error fetching book details using async-await:', error);
  }
}

//const isbn = '9780142437223';
//getBookByISBNUsingPromise(isbn);
//getBookByISBNUsingAsyncAwait(isbn);

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

function getBookByAuthorUsingPromise(author) {
  axios.get(`http://localhost:5000/author/${author}`)
      .then(response => {
        console.log('Book details using promise: ', response.data);
      })
      .catch(error => {
        //console.error('Error fetching book details using Promise: ', error);
      })
}


async  function getBookByAuthorUsingAsyncAwait(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log('Book details using async-await: ', response.data);
  } catch (error) {
    console.error('Error fetching book detail using async-await: ', error)
  }
}

//getBookByAuthorUsingPromise('Dante Alighieri');
//getBookByAuthorUsingAsyncAwait('Dante Alighieri');

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

function getBooksByTitleUsingPromise(title) {
  axios.get(`http://localhost:5000/title/${title}`)
      .then(response => {
        console.log('Get book detail by title with Promise: ', response.data);
      })
      .catch(error => {
        console.log('Get book detail by title with Promise: ', error);
      })
}

async function getBooksByTitleUsingAsyncAwait(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`)
    console.log('Book details by title using async-await: ', response.data);
  } catch (error) {
    console.error('Error fetching book detail using async-await: ', error)
  }
}

getBooksByTitleUsingPromise("The Divine Comedy");
getBooksByTitleUsingAsyncAwait("The Divine Comedy");

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
