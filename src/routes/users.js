const express = require("express");
const router = express.Router();
const conn = require("../mariadb");
const jwt = require("jsonwebtoken");
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
    validate,
  ],
  (req, res) => {
    let { email, password } = req.body;

    let sql = `INSERT INTO readers(email, password)
    VALUES (?, ?)`;
    let values = [email, password];
    conn.query(sql, values, function (err, results) {
      if (err) {
        return res.status(400).end();
      }

      res.status(201).json(results);
    });
  }
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
  (req, res) => {
    let { email, password } = req.body;

    let sql = `SELECT * FROM readers WHERE email=?`;
    conn.query(sql, email, function (err, results) {
      if (err) {
        return res.status(400).end();
      }

      reader = results[0];
      if (reader && reader.password == password) {
        const token = jwt.sign(
          {
            email: reader.email,
            password: reader.password,
          },
          process.env.PRIVATE_KEY,
          {
            expiresIn: "10m",
            issuer: "admin",
          }
        );

        res.cookie("token", token, {
          httpOnly: true,
        });

        res.status(200).json(results);
      } else {
        return res.status(400).end();
      }
    });
  }
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
    (req, res) => {
      let { email } = req.body;

      let sql = `SELECT * FROM readers WHERE email=?`;
      conn.query(sql, email, function (err, results) {
        if (err) {
          return res.status(400).end();
        }

        reader = results[0];
        if (reader) {
          const token = jwt.sign(
            {
              email: reader.email,
            },
            process.env.PRIVATE_KEY,
            {
              expiresIn: "10m",
              issuer: "admin",
            }
          );

          res.cookie("token", token, {
            httpOnly: true,
          });
          res.status(200).json(results);
        } else {
          return res.status(400).end();
        }
      });
    }
  )
  // 비밀번호 초기화 (=수정)
  .put(
    [
      body("email")
        .notEmpty()
        .isEmail()
        .withMessage("정확한 이메일을 입력해주세요"),
      body("pasword").notEmpty().withMessage("정확한 이메일을 입력해주세요"),
      validate,
    ],
    (req, res) => {
      let { email, password } = req.body;

      let sql = `UPDATE readers SET password = ? WHERE email=?`;
      let values = [email, password];
      conn.query(sql, values, function (err, results) {
        if (err) {
          return res.status(400).end();
        }

        reader = results[0];
        if (reader) {
          const token = jwt.sign(
            {
              email: reader.email,
              password: reader.password,
            },
            process.env.PRIVATE_KEY,
            {
              expiresIn: "10m",
              issuer: "admin",
            }
          );
          res.status(200).json(results);
        } else {
          return res.status(400).end();
        }
      });
    }
  );

module.exports = router;
