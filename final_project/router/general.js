const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
      if (isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

//using callback
function getBookList(list,callback){
    if(list){
      callback(null, list);
    }
    else{
      callback(new Error("book list not found"));
    }
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {

//using callback
  getBookList(books, function(err,booklist){
    if(err){
      res.status(404).send(err);
    }
    else{
      res.status(200).send(booklist)
    }
  })

//using promise
// const booklist = new Promise((resolve,reject)=>{
//     try{
//         resolve(books);
//     }
//     catch(err){
//         reject(err);
//     }
// });
//     booklist.then(
//         (data) => res.status(200).send(data),
//         (err) => res.status(404).send(err));

// without any method
//   res.status(300).send(JSON.stringify(books,null,4));
});


function getBookByISBN(isbn, callback) {
    let book = books[isbn];
    if (book) {
      callback(null, book); // Pass null as the error and the book data to the callback
    } else {
      callback(new Error('Book not found')); // Pass an error to the callback
    }
  }


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;

//using promise
  const book = new Promise((resolve,reject)=>{
    try{
      resolve(data[isbn]);
    }
    catch(err){
      reject(err);
    }
  });

  book.then(
    (data)=>res.status(200).send(data),
    (err)=>res.status(404).json({message: "book not found"}));

//using callback
// getBookByISBN(isbn, function (error, book) {
//     if (error) {
//       res.status(404).send(error.message);
//     } else {
//       res.status(200).send(book);
//     }
//   });

//without any method
//   let book = books[isbn];
//   res.status(300).send(book);
});

async function getBookByAuthor(author){
    for(const key in books){
        if(books[key]["author"] === author){
            return books[key];
        }
    }
    return {message: "no book found"}
}  

// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  let author = req.params.author;

//using async/await
  const book = await getBookByAuthor(author);
  res.send(book);

//without any method
//   for(const key in books){
//     if (books[key]["author"] == author){
//         return res.status(200).send(books[key]);
//     }
//   }
//   res.status(300).json({message: "book not found"});
});

function getBookByTitle(title,callback){
    for(const key in books){
        if(books[key]["title"] === title){
            callback(null, books[key]);
        }
    }
    callback(new Error("book not found"));
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
  
//using callback
    getBookByTitle(title, function(err,book){
        if(err){
            res.status(404).send(err);
        }
        else{
            res.status(200).send(book);
        }
    });

//without any method
    // for(const key in books){
    //   if (books[key]["title"] == title){
    //       return res.status(200).send(books[key]);
    //   }
    // }
    // res.status(300).json({message: "book not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn]["reviews"];
  res.status(300).send(book);
});

module.exports.general = public_users;
