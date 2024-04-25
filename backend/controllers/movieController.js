const {
  connectionMySQL,
  queryDatabase,
  apiKey,
} = require("../connectionMySQL");

// get all categories
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

// get category by Id
exports.getCategory = async (req, res) => {
  const { id } = req.params;
  let sql =
    "SELECT categoryName FROM category WHERE categoryName LIKE CONCAT('%',?,'%')";
  try {
    const getCategory = await queryDatabase(sql, id);

    if (getCategory.length > 0) {
      res.json(getCategory);
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

// movies get movies with limit
exports.getMovies = async (req, res) => {
  const { amount } = req.params;
  try {
    const getMoviesArray = await queryDatabase(
      "SELECT * FROM movie LIMIT ? ",
      Number(amount),
    );
    res.json(getMoviesArray);
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

exports.getSpecificMovie = async (req, res) => {
  const { movieId } = req.params;
  let sql =
    "SELECT m.movieName, m.movieYear, m.movieDescription, m.moviePoster, m.movieRuntime, JSON_ARRAYAGG(JSON_OBJECT('personId', p.personId, 'personName', p.personName, 'jobTitle', j.jobTitle)) AS cast, (SELECT JSON_ARRAYAGG(categoryName) FROM (SELECT DISTINCT c.categoryName FROM category c JOIN movieCategory mc ON c.categoryId = mc.movieCategoryCID WHERE mc.movieCategoryMID = m.movieId) AS distinct_categories) AS categories FROM movie AS m JOIN movieJobPerson AS mjp ON m.movieId = mjp.movieJobPersonMID JOIN person AS p ON mjp.movieJobPersonPID = p.personId JOIN job AS j on mjp.movieJobPersonJID = j.jobId WHERE m.movieId = ?";
  try {
    const getMovieArray = await queryDatabase(sql, movieId);
    if (getMovieArray.length > 0) {
      res.json(getMovieArray);
    }
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

// delete movie by id
exports.deleteMovie = async (req, res) => {
  const { id } = req.params;
  let sql = "CALL deleteMovie(?)";

  if (!id) {
    return res.status(400).json({
      success: false,
      error: "Du har inte skrivit in något ID för filmen du vill radera!",
    });
  }
  try {
    const deleteMovie = await queryDatabase(sql, id);

    return res.status(201).json({
      success: true,
      error: "",
      message: "Filmen är nu raderad!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Ändra beskrvning av film beroende på filmid

exports.changeMovieDescription = async (req, res) => {
  const { description, movieId } = req.body;
  let sql = "UPDATE movie SET movieDescription = ? where movieId = ?";
  try {
    const newDescription = await queryDatabase(sql, [description, movieId]);
    return res.status(201).json({
      success: true,
      error: "",
      message: "ny beskrivning inlaggd!",
      nybeskrivning: description,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
  res.json({ beskrivning: description, id: movieId });
};
