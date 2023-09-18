const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return false;
      } else {
        return true;
      }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: username
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        "accessToken": accessToken,
        // "username": username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {  
    let isbn = req.params.isbn;
    let user_review = req.body.review;
    let user = req.user["data"];
    console.log(`user: ${user}`);
    book_reviews = books[isbn]["reviews"];
    books[isbn]["reviews"][user] = user_review;
    res.status(200).json({message: "review added"});
});

regd_users.delete("/auth/review/:isbn", (req,res) => {
    let isbn = req.params.isbn;
    let user = req.user["data"];
    console.log(books[isbn]["reviews"][user]);
    delete books[isbn]["reviews"][user];
    res.status(200).json({message: "review deleted"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
