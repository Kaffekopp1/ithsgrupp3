const { connectionMySQL, queryDatabase } = require("../connectionMySQL");

exports.getCategories = async (req, res) => {
  try {
    const getCategories = await queryDatabase(
      "SELECT * FROM category WHERE categoryId = ?",
      [10],
    );
    console.log(getCategories);

    if (getCategories.length > 0) {
      res.json(getCategories);
    } else {
      res.json({
        error: "Inget resultat",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.getCategory = async (req, res) => {
  const { id } = req.params;
  try {
    let sql = 'SELECT categoryName FROM category WHERE title REGEXP "id?"';

    const getCategory = await queryDatabase(sql, [10]);

    if (getCategory.length > 0) {
      res.json(this.getCategory);
    } else {
      res.json({
        error: "Inget resultat",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
// movies get
exports.getMovies = async (req, res) => {
  res.send("hej");
};
