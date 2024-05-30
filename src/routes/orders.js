const express = require("express");
const router = express.Router();
const conn = require("../mariadb");
const dotenv = require("dotenv");
const { body, param, validationResult } = require("express-validator");
dotenv.config();

router.use(express.json());

const {
  payment,
  getAllOrders,
  getDetailOrders,
} = require("../controllers/OrdersController");

const validate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next();
  } else {
    return res.status(400).json(err.array());
  }
};

router.route("/").post(payment).get(getAllOrders);

router.get("/:orderId", getDetailOrders);

module.exports = router;
