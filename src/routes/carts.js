const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const { body, param, validationResult } = require("express-validator");
dotenv.config();

router.use(express.json());

const {
  addCartItems,
  selectCartItems,
  deleteCartItems,
  checkedCartItems,
} = require("../controllers/CartsController");

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
      body("quantity")
        .notEmpty()
        .isInt()
        .withMessage("주문 수량이 필요합니다."),
      body("reader_id")
        .notEmpty()
        .isInt()
        .withMessage("사용자 ID가 필요합니다."),
      validate,
    ],
    addCartItems
  )

  // 장바구니 조회
  .get(
    [
      body("reader_id")
        .notEmpty()
        .isInt()
        .withMessage("사용자 ID가 필요합니다."),
    ],
    selectCartItems
  )

  // 장바구니에서 선택한 주문 예상 상품 목록 조회
  .get(
    [
      body("reader_id")
        .notEmpty()
        .isInt()
        .withMessage("사용자 ID가 필요합니다."),
      body("checked_items")
        .notEmpty()
        .isArray()
        .withMessage("주문 목록이 필요합니다."),
      validate,
    ],
    checkedCartItems
  );

// 장바구니 도서 삭제
router.delete(
  "/:id",
  [param("id").notEmpty().withMessage("주문 ID가 필요합니다."), validate],
  deleteCartItems
);

module.exports = router;
