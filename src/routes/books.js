const express = require("express");
const router = express.Router();
const conn = require("../mariadb");
const dotenv = require("dotenv");
const { body, param, validationResult } = require("express-validator");
dotenv.config();

router.use(express.json());

const validate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next();
  } else {
    return res.status(400).json(err.array());
  }
};

// 전체 도서 조회
router.get("/", (req, res) => {
  let sql = "SELECT * FROM books";
  conn.query(sql, function (err, results) {
    res.status(200).json(books);
  });
});

// 개별 도서 조회
router.get(
  "/:book_id",
  [
    param("book_id").notEmpty().isInt().withMessage("책 ID가 필요합니다."),
    validate,
  ],
  (req, res) => {
    let { book_id } = req.params;
    book_id = parseInt(id);

    let sql = `SELECT * FROM books WHERE id = ?`;
    conn.query(sql, book_id, function (err, results) {
      if (err) {
        return res.status(400).end();
      }

      if (results.length) {
        res.status(200).json(results);
      } else {
        return res.status(400).end();
      }
    });
  }
);

// 카테고리별 도서 목록 조회
router.get(
  "/category_id=:category_id",
  [
    param("category_id")
      .notEmpty()
      .isInt()
      .withMessage("카테고리 ID가 필요합니다."),
    validate,
  ],
  (req, res) => {
    let { category_id } = req.params;
    category_id = parseInt(category_id);

    let sql = `SELECT * FROM books WHERE category_id = ?`;
    conn.query(sql, category_id, function (err, results) {
      if (err) {
        return res.status(400).end();
      }
      res.status(200).json(results);
    });
  }
);

module.exports = router;
