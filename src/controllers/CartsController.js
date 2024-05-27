const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const addCartItems = (req, res) => {
  let { book_id, quantity, reader_id } = req.body;

  let sql = `INSERT INTO cartItems (book_id, quantity, reader_id)
      VALUES(?, ?, ?)`;
  let values = [book_id, quantity, reader_id];
  conn.query(sql, values, function (err, results) {
    if (err) return res.status(400).end();

    res.status(201).json(results);
  });
};

const selectCartItems = (req, res) => {
  let { reader_id } = req.body;

  let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price
  FROM cartItems
  LEFT JOIN books 
  ON cartItems.book_id = books.id
  WHERE reader_id = ?`;
  conn.query(sql, reader_id, function (err, results) {
    if (err) return res.status(400).end();

    res.status(200).json(results);
  });
};

const deleteCartItems = (req, res) => {
  let { id } = req.params;
  id = parseInt(id);

  let sql = `DELETE FROM cartItems WHERE id = ?`;
  conn.query(sql, id, function (err, results) {
    if (err) return res.status(400).end();

    res.status(200).json(results);
  });
};

const checkedCartItems = (req, res) => {
  let { reader_id, checked_items } = req.body;

  let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price
      FROM cartItems
      LEFT JOIN books 
      ON cartItems.book_id = books.id
      WHERE reader_id = ?
      AND id IN (?)`;
  const values = [reader_id, checked_items];
  conn.query(sql, values, function (err, results) {
    if (err) return res.status(400).end();

    res.status(200).json(results);
  });
};

module.exports = {
  addCartItems,
  selectCartItems,
  deleteCartItems,
  checkedCartItems,
};
