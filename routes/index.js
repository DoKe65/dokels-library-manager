const express = require('express');
const db = require('../models');
const router = express.Router();
// Import Book model
const Book = require("../models").Book;

router.get("/", (req, res, next) => {
  res.redirect("/books");
});

/**
 * "asyncHandler", handler function to wrap the routes
 * @param {cb} - callback function 
 * returns an asynchronous try/catch block
 */
 function asyncHandler(cb) {
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (error) {
      // Pass error to the global error handler in app.js
     next(error);
    }
  }
}

// get all Books
router.get("/books", asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render("index", { books, title: "Books" });
}));


module.exports = router;
