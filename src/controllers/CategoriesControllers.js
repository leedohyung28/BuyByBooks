const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const selectAllCategories = (req, res) => {
  let sql = "SELECT * FROM category";
  conn.query(sql, function (err, results) {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    res.status(StatusCodes.OK).json(results);
  });
};

module.exports = selectAllCategories;
