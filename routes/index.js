const express = require('express');
const { get } = require('express/lib/response');
const db = require('../models');
const router = express.Router();
// Import Book model
const Book = require("../models").Book;

router.get("/", (req, res, next) => {
  res.redirect("/books");
});

/**
 * "asyncHandler", handler function to wrap the routes
 * @param {function} - cb, the callback function 
 * returns an asynchronous try/catch block
 */
 function asyncHandler(cb) {
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (error) {
      // Pass error to the global error handler in app.js
     next(error);
    // return error;
    }
  }
}

/**
 * GET all articles to be listed on start page
 */
router.get("/books", asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render("index", { books, title: "Books" });
}));

/**
 * Render the form to register a new book
 */
 router.get('/books/new-book', (req, res, next) => {
  res.render("new-book", {book: {}, title: "Create New Book", btnText: "Create Book"});
});

/**
 * POST and CREATE new book from form and return to the book list (home page)
 */
 router.post("/books/new-book", asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books");
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("new-book", { book, errors: error.errors, title: "Create new Book", btnText: "Create New Book" });
    } else {
      throw Error;
    }
  }
}));

/**
 * GET individual book by ID and display it on a detailed page
 */
router.get("/books/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("book-detail", { title: "Book Details", book});
  } else {
    res.sendStatus(404);
  }
}));

/**
 * GET a book by its ID and render it in the update-book form
 */
router.get("/books/:id/update-book", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("update-book", { book, title: "Update Book", btnText: "Update Book" });
  } else {
    res.sendStatus(404);
  }
}));

/**
 * POST the updated book information and go back to book list
 */
router.post("/books/:id/update-book", asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/books");
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("update-book", { book, errors: error.errors, title: "Update Book", btnText: "Update Book" });
    } else {
      throw error;
    }
  }
}));

/**
 * GET a book by its id and render it in the delete form
 */
router.get("/books/:id/delete", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("delete", { book, title: "Delete Book", btnText: "Delete Book" });
  } else {
    res.sendStatus(404);
  }
}));

/**
 * POST the destruction of the book to delete it
 */
router.post("/books/:id/delete", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;
