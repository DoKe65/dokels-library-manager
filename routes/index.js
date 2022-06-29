const express = require('express');
const { get, redirect } = require('express/lib/response');
const db = require('../models');
const router = express.Router();
const sequelize = require("Sequelize");
const { query } = require('express');
const Op = sequelize.Op;
// Import Book model
const Book = require("../models").Book;

// redirect to books page
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
    }
  }
}

/**
 * GET all articles to be listed on start page and adds pagination buttons
 * if a search term is present, use that to get the matching books and create
 * the pagination buttons according to the test results
 */
router.get("/books/", asyncHandler(async (req, res) => {
  let btns = [];
  let { searchTerm, page, bksToDisplay } = req.query;

  // Make sure to start with 5 books on the first page on start
  if (!page || !bksToDisplay) {
    page = 0;
    bksToDisplay = 5;
  }
  // Basic query object for the findAndCoutAll query on the book object, needed for pagination
  const queryObj = {
    limit: bksToDisplay,
    offset: page * bksToDisplay
  }

  // function to create the pagination buttons
  function createPagBtns(numBtns) {
    // let btns = [];
    for (let i=1; i < numBtns+1; i++) {
      btns.push({
        btnNr: i, 
        page: i-1, 
        bksToDisplay: bksToDisplay, 
        className: "button",
      });
    }
  }
  
  // if there's no search term, find All books and create pagination buttons according to the result
  if(!searchTerm) {
    
    const { count, rows } = await Book.findAndCountAll(queryObj);
    const books = rows;
    const totalBooks = count;
    const numBtns = Math.ceil(totalBooks / bksToDisplay);
    createPagBtns(numBtns);
    res.render("index", { books, btns, title: "Books" });
  } else {
    // If there's a search term, use it to find all matching books and create pagination buttons according to the result
    // Extend the query object to take in the search term
    queryObj.where = {
      [Op.or]: {
        title: { [Op.like]: `%${searchTerm}%` },
        author: { [Op.like]: `%${searchTerm}%` },
        genre: { [Op.like]: `%${searchTerm}%` },
        year: { [Op.like]: `%${searchTerm}%` }
      }
    }
    const { count, rows } = await Book.findAndCountAll(queryObj);
    const books = rows;
    const totalBooks = count;
    const numBtns = Math.ceil(totalBooks / bksToDisplay);
    createPagBtns(numBtns);
    let message;
    if(btns.length === 0) {
      message = `Sorry! Ther are no books matching your search for "${searchTerm}".`;
    } else {
      message = `We found ${totalBooks} books matching your search for "${searchTerm}":`;
    }

    res.render("index", { books, btns, message, searchTerm, title: "Search Result" });
  }
}));

/**
 * Render the form to register a new book
 */
router.get("/query", (req, res, next) => {
  res.redirect("/books/new-book");
});

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
      throw error;
    }
  }
}));

/**
 * GET individual book by ID and display it on a detailed page
 */
router.get("/books/:id", asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("book-detail", { title: "Book Details", book});
  } else {
    const err = new Error();
    err.status = 404;
    err.message = "Sorry! We can't find any books with that ID";
    next(err);
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
