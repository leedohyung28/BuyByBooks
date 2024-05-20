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
  .route("/:book_id")
  // 좋아요 추가
  .post(
    [
      param("book_id").notEmpty().isInt().withMessage("책 ID가 필요합니다."),
      body("reader_id")
        .notEmpty()
        .isInt()
        .withMessage("사용자 ID가 필요합니다."),
      validate,
    ],
    (req, res) => {
      let { reader_id } = req.body;
      let { book_id } = req.params;
      reader_id = parseInt(reader_id);
      book_id = parseInt(id);

      let sql = `INSERT INTO likes (reader_id, liked_book_id)
      VALUES (?, ?)`;
      const values = [reader_id, book_id];
      conn.query(sql, values, function (err, results) {
        if (err) {
          return res.status(400).end();
        }
        res.status(200).json(results);
      });
    }
  )
  // 좋아요 취소
  .delete(
    [
      param("book_id").notEmpty().isInt().withMessage("책 ID가 필요합니다."),
      body("reader_id")
        .notEmpty()
        .isInt()
        .withMessage("사용자 ID가 필요합니다."),
      validate,
      validate,
    ],
    (req, res) => {
      let { reader_id } = req.body;
      let { book_id } = req.params;
      reader_id = parseInt(reader_id);
      book_id = parseInt(id);

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
    }
  );

module.exports = router;
