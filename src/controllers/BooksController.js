const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const selectBooks = (req, res) => {
  let { category_id, recentOneMonth, limit, currentPage } = req.query;

  // limit : page 당 도서 수
  // currentPage : 현재 페이지
  // offset : limit * (currentPage - 1)
  let offset = limit * (currentPage - 1);

  let sql = `SELECT *, 
    (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes
     FROM books`;
  let values = [];

  if (category_id) {
    category_id = parseInt(category_id);
    sql += ` WHERE category_id = ?`;
    values.push(category_id);
  }
  if (recentOneMonth) {
    if (category_id) sql += " AND";
    else sql += " WHERE";

    sql += " published_at BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
  }

  sql += " LIMIT ? OFFSET ?";
  values.push(parseInt(limit), offset);

  conn.query(sql, values, function (err, results) {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (values.length) {
      if (results.length) {
        res.status(StatusCodes.OK).json(results);
      } else {
        return res.status(StatusCodes.NOT_FOUND).end();
      }
    } else {
      res.status(StatusCodes.OK).json(results);
    }
  });
};

const selectSingleBook = (req, res) => {
  let { reader_id } = req.body;
  let { book_id } = req.params;
  book_id = parseInt(book_id);

  let sql = `SELECT *, 
        (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes,
        (SELECT EXISTS (SELECT * FROM likes WHERE reader_id=? AND liked_book_id=?)) AS liked
        FROM books 
        LEFT JOIN category 
        ON books.category_id = category.id 
        WHERE books.id = ?`;
  let values = [reader_id, book_id, book_id];
  conn.query(sql, values, function (err, results) {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results[0]) {
      res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });
};

module.exports = {
  selectBooks,
  selectSingleBook,
};
