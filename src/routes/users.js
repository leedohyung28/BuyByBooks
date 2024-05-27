const express = require("express");
const router = express.Router();
const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const { body, validationResult } = require("express-validator");

router.use(express.json());

const {
  register,
  login,
  pwreset,
  pwchange,
} = require("../controllers/UserController");

const validate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next();
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json(err.array());
  }
};

// 회원 가입
router.post(
  "/register",
  [
    body("email")
      .notEmpty()
      .isEmail()
      .withMessage("정확한 이메일을 입력해주세요"),
    body("password")
      .notEmpty()
      .isString()
      .withMessage("정확한 비밀번호를 입력해주세요"),
    body("nickname")
      .notEmpty()
      .isString()
      .withMessage("정확한 비밀번호를 입력해주세요"),
    validate,
  ],
  register
);

// 로그인
router.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .isEmail()
      .withMessage("정확한 이메일을 입력해주세요"),
    body("password")
      .notEmpty()
      .isString()
      .withMessage("정확한 비밀번호를 입력해주세요"),
    validate,
  ],
  login
);

router
  .route("/pwreset")
  // 비밀번호 초기화 요청
  .post(
    [
      body("email")
        .notEmpty()
        .isEmail()
        .withMessage("정확한 이메일을 입력해주세요"),
      validate,
    ],
    pwreset
  )
  // 비밀번호 초기화 (=수정)
  .put(
    [
      body("pasword").notEmpty().withMessage("정확한 이메일을 입력해주세요"),
      validate,
    ],
    pwchange
  );

module.exports = router;
