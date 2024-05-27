const express = require("express");
const router = express.Router();

router.use(express.json());

const selectAllCategories = require("../controllers/CategoriesController");

// 전체 카테고리 조회
router.get("/", selectAllCategories);

module.exports = router;
