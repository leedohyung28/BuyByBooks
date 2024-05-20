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

router
  .route("/")
  // 장바구니 담기
  .post(
    [
      body("book_id").notEmpty().isInt().withMessage("책 ID가 필요합니다."),
      body("count").notEmpty().isInt().withMessage("책 ID가 필요합니다."),
      validate,
    ],
    (req, res) => {
      let { book_id, count } = req.body;
      book_id = parseInt(book_id);
      count = parseInt(count);

      let sql = `INSERT INTO cart (book_id, count)
        VALUES(?, ?)`;
      let values = [book_id, count];
      conn.query(sql, values, function (err, results) {
        if (err) return res.status(400).end();

        res.status(201).json(results);
      });
    }
  )
  // 장바구니 조회
  .get([], (req, res) => {
    let sql = `SELECT * FROM cart`;
    conn.query(sql, function (err, results) {
      if (err) return res.status(400).end();

      res.status(200).json(results);
    });
  });

// 장바구니 도서 삭제
router.delete(
  "/:book_id",
  [param("book_id").notEmpty().withMessage("책 ID가 필요합니다."), validate],
  (req, res) => {
    let { book_id } = req.params;
    book_id = parseInt(book_id);

    let sql = `DELETE FROM cart WHERE book_id = ?`;
    conn.query(sql, book_id, function (err, results) {
      if (err) return res.status(400).end();

      res.status(200).json(results);
    });
  }
);

module.exports = router;
