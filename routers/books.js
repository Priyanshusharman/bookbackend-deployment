const express = require('express');
const router = express.Router();
const { isAuthenticatedUser } = require("../middleware/auths");
const Book = require('../models/book');
const getBook = require("../middleware/getBook");
const ApiFeatures = require('../utils/apifeatures');

// GET /books - Retrieve all books with search and pagination
router.get('/', async (req, res) => {
  try {
    const resultPerPage = 12;
    const bookCount = await Book.countDocuments();

    const apiFeatures = new ApiFeatures(Book.find(), req.query)
      .search()
      .filter()
      .pagination(resultPerPage);

    const books = await apiFeatures.query;

    res.json({
      success: true,
      bookCount,
      resultPerPage,
      books,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /books/:id - Retrieve a book by its ID
router.get('/:id', getBook, (req, res) => {
  res.json(res.book);
});

// POST /books - Add a new book
router.post('/', isAuthenticatedUser, async (req, res) => {
  const { title, author, genre, yearPublished } = req.body;
  const book = new Book({
    title,
    author,
    genre,
    yearPublished,
  });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /books/:id - Update an existing book by its ID
router.put('/:id', isAuthenticatedUser, getBook, async (req, res) => {
  const { title, author, genre, yearPublished } = req.body;
  if (title) res.book.title = title;
  if (author) res.book.author = author;
  if (genre) res.book.genre = genre;
  if (yearPublished) res.book.yearPublished = yearPublished;

  try {
    const updatedBook = await res.book.save();
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /books/:id - Delete a book by its ID
router.delete('/:id', isAuthenticatedUser, getBook, async (req, res) => {
  try {
    await res.book.deleteOne();
    res.json({ message: 'Deleted Book' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
