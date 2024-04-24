const {
  connectionMySQL,
  queryDatabase,
  apiKey,
} = require("../connectionMySQL");

// get all categories
exports.getCategories = async (req, res) => {
  try {
    const getCategories = await queryDatabase("SELECT * category");
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

// get category by Id
exports.getCategory = async (req, res) => {
  const { id } = req.params;
  let sql = "SELECT categoryName FROM category WHERE categoryId = ?";
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

exports.getCategoryBySearch = async (req, res) => {
  const { search } = req.params;
  let sql = "SELECT categoryName FROM category WHERE categoryName LIKE ?";
  try {
    const getCategoryBySearch = await queryDatabase(sql, search);
    console.log("Hej");
    if (getCategoryBySearch.length > 0) {
      res.json(getCategoryBySearch);
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
// get actors from movie
exports.getActorsMovie = async (req, res) => {
  const { movie } = req.params;
  let sql =
    "SELECT personName, personBorn FROM movie INNER JOIN movieJobPerson mJP on movie.movieId = mJP.movieJobPersonMID INNER JOIN job j on mJP.movieJobPersonJID = j.jobId INNER JOIN person p on mJP.movieJobPersonPID = p.personId WHERE movieName = ? AND jobTitle = 'Actor' ";
  try {
    const getActorArray = await queryDatabase(sql, movie);
    res.json(getActorArray);
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

// Importera film
exports.importMovie = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    if (tmdbId) {
      const getMovieInformation = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbId}?language=en-US`,
        apiKey,
      );
      const getMovieResults = await getMovieInformation.json();

      if (getMovieResults.success !== false) {
        const insertMovie_sql =
          "INSERT INTO movie (movieName, movieYear, movieDescription, moviePoster, movieRuntime) VALUES (?, ?, ?, ?, ?)";
        const convertedYear = new Date(
          getMovieResults.release_date,
        ).getFullYear();
        const moviePoster = `https://image.tmdb.org/t/p/w300${getMovieResults.poster_path}`;

        const insertMovie = await queryDatabase(insertMovie_sql, [
          getMovieResults.title,
          convertedYear,
          getMovieResults.overview,
          moviePoster,
          getMovieResults.runtime,
        ]);

        const getCast = await fetch(
          `https://api.themoviedb.org/3/movie/${tmdbId}?language=en-US`,
          apiKey,
        );
        const getCastResults = await getMovieInformation.json();

        res.json(insertMovie.insertId);
      } else {
        res.json({
          error: "Inget resultat...",
        });
      }
    }
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};
