const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");

router.use(express.json());

const {
  selectBooks,
  selectSingleBook,
} = require("../controllers/BooksControllers");

const validate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next();
  } else {
    return res.status(400).json(err.array());
  }
};

// 전체 도서 조회
// 카테고리별 도서 목록 조회 + 신간(한달 이내) 도서 목록 조회)
router.get("/", selectBooks);

// 개별 도서 조회
router.get(
  "/:book_id",
  [
    param("book_id").notEmpty().isInt().withMessage("책 ID가 필요합니다."),
    validate,
  ],
  selectSingleBook
);

// router.get(
//   "/category_id=:category_id",
//   [
//     param("category_id")
//       .notEmpty()
//       .isInt()
//       .withMessage("카테고리 ID가 필요합니다."),
//     validate,
//   ],
//   selectBooksByCategory
// );

module.exports = router;
