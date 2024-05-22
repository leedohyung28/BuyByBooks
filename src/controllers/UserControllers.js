const conn = require("../mariadb");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");

dotenv.config();

const register = (req, res) => {
  let { email, password, nickname } = req.body;

  const salt = crypto.randomBytes(64).toString("base64");
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("base64");

  let sql = `INSERT INTO readers(email, password, nickname, salt)
    VALUES (?, ?, ?, ?)`;
  let values = [email, hashPassword, nickname, salt];
  conn.query(sql, values, function (err, results) {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    res.status(StatusCodes.CREATED).json(results);
  });
};

const login = (req, res) => {
  let { email, password } = req.body;

  let sql = `SELECT * FROM readers WHERE email=?`;
  conn.query(sql, email, function (err, results) {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const reader = results[0];

    const hashPassword = crypto
      .pbkdf2Sync(password, reader.salt, 10000, 64, "sha512")
      .toString("base64");

    if (reader && reader.password == hashPassword) {
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

      res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};

const pwreset = (req, res) => {
  let { email } = req.body;

  let sql = `SELECT * FROM readers WHERE email=?`;
  conn.query(sql, email, function (err, results) {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const reader = results[0];
    if (results.affectedRows == 0) {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    } else {
      res.status(StatusCodes.OK).json({ email: email });
    }
  });
};

const pwchange = (req, res) => {
  let { email, password } = req.body;

  let sql = `UPDATE readers SET password = ?, salt = ? WHERE email=?`;

  const salt = crypto.randomBytes(64).toString("base64");
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("base64");

  let values = [hashPassword, salt, email];
  conn.query(sql, values, function (err, results) {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results.affectedRows == 0) {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    } else {
      res.status(StatusCodes.OK).json(results);
    }
  });
};

module.exports = {
  register,
  login,
  pwreset,
  pwchange,
};
