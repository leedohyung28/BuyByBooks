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
router
  .route("/")
  .post(
    [
      param("category_id")
        .notEmpty()
        .isInt()
        .withMessage("카테고리 ID가 필요합니다."),
      validate,
    ],
    (req, res) => {
      let sql = "SELECT * FROM books";
      conn.query(sql, function (err, results) {
        res.status(200).json(books);
      });
    }
  )
  .get((req, res) => {});

// 카테고리별 도서 목록 조회
router.get(
  "/:orders",
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
