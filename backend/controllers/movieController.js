const { connectionMySQL, queryDatabase } = require("../connectionMySQL");

exports.getCategories = async (req, res) => {
  try {
    const getCategories = await queryDatabase("SELECT * FROM category");

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

  let sql = "SELECT categoryName FROM category WHERE categoryId = ?";
  try {
    await connectionMySQL.query(sql, [id], (error, results) => {
      if (error) {
        throw error;
      }

      res.json(results);
    });
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
