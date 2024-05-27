const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const addLike = (req, res) => {
  let { reader_id } = req.body;
  let { book_id } = req.params;
  reader_id = parseInt(reader_id);
  book_id = parseInt(book_id);

  let sql = `INSERT INTO likes (reader_id, liked_book_id)
    VALUES (?, ?)`;
  const values = [reader_id, book_id];
  conn.query(sql, values, function (err, results) {
    if (err) {
      return res.status(400).end();
    }
    res.status(200).json(results);
  });
};

const removeLike = (req, res) => {
  let { reader_id } = req.body;
  let { book_id } = req.params;
  reader_id = parseInt(reader_id);
  book_id = parseInt(book_id);

  let sql = `DELETE from likes WHERE reader_id = ? AND liked_book_id = ?`;
  const values = [reader_id, book_id];
  conn.query(sql, values, function (err, results) {
    if (err) {
      return res.status(400).end();
    }

    if (results.affectedRows == 0) {
      return res.status(400).end();
    } else {
      res.status(200).json(results);
    }
  });
};

module.exports = { addLike, removeLike };
