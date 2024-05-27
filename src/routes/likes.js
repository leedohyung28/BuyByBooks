const express = require("express");
const router = express.Router();
const conn = require("../mariadb");
const dotenv = require("dotenv");
const { body, param, validationResult } = require("express-validator");
dotenv.config();
const { addLike, removeLike } = require("../controllers/LikesController");

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
    addLike
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
    removeLike
  );

module.exports = router;
