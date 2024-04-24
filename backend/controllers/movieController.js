const {
  connectionMySQL,
  queryDatabase,
  apiKey,
} = require("../connectionMySQL");

// get all categories
exports.getCategories = async (req, res) => {
  try {
    const getCategories = await queryDatabase("SELECT * FROM category");
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

// get category by search
exports.getCategoryBySearch = async (req, res) => {
  const { search } = req.params;
  let sql =
    "SELECT categoryName FROM category WHERE categoryName LIKE CONCAT('%',?,'%')";
  try {
    const getCategoryBySearch = await queryDatabase(sql, search);

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

// get movie by search with limit
exports.getMovieBySearch = async (req, res) => {
  const { keyword, amount } = req.params;
  let sql =
    "SELECT movieId, movieName, movieYear, moviePoster FROM movie WHERE movieName LIKE CONCAT('%',?,'%') LIMIT ?";
  try {
    const getMovieBySearch = await queryDatabase(sql, [
      keyword,
      Number(amount),
    ]);

    if (getMovieBySearch.length > 0) {
      res.json(getMovieBySearch);
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
    "SELECT personName, personBorn FROM movie INNER JOIN movieJobPerson mJP on movie.movieId = mJP.movieJobPersonMID INNER JOIN job j on mJP.movieJobPersonJID = j.jobId INNER JOIN person p on mJP.movieJobPersonPID = p.personId WHERE movieName LIKE CONCAT('%',?,'%') AND jobTitle = 'Actor'  ";
  try {
    const getActorArray = await queryDatabase(sql, movie);
    res.json(getActorArray);
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

// get all movies from specific actor:

exports.getActor = async (req, res) => {
  const { actor } = req.params;
  let sql =
    "SELECT movieName, movieYear, movieId FROM movie INNER JOIN movieJobPerson mJP on movie.movieId = mJP.movieJobPersonMID JOIN job j on mJP.movieJobPersonJID = j.jobId JOIN person p on mJP.movieJobPersonPID = p.personId WHERE personName LIKE CONCAT('%',?,'%') ";
  try {
    const getActorArray = await queryDatabase(sql, actor);
    res.json(getActorArray);
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};

// search db after person, category and persons obs: only works if procedure "searcher" exists
exports.getFromSearch = async (req, res) => {
  const { keyword } = req.params;
  console.log("keyWord", keyword);
  let sql = "call searcher( ? )";
  try {
    const getSearchResult = await queryDatabase(sql, keyword);
    res.json(getSearchResult);
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
          "INSERT INTO movie (movieName, movieYear, movieDescription, moviePoster, movieRuntime, movietmdbId) VALUES (?, ?, ?, ?, ?, ?)";
        const convertedYear = new Date(
          getMovieResults.release_date,
        ).getFullYear();

        const insertMovie = await queryDatabase(insertMovie_sql, [
          getMovieResults.title,
          convertedYear,
          getMovieResults.overview,
          getMovieResults.poster_path,
          getMovieResults.runtime,
          tmdbId,
        ]);

        // Sätter in kategorier för en film
        for (let i = 0; i < getMovieResults.genres.length; i++) {
          let checkCategory = await queryDatabase(
            "SELECT categoryId FROM category WHERE categoryName = ?",
            getMovieResults.genres[i].name,
          );

          if (checkCategory.length === 0) {
            let insertNewCategory = await queryDatabase(
              "INSERT INTO category (categoryName) VALUES (?)",
              getMovieResults.genres[i].name,
            );
            await queryDatabase(
              "INSERT INTO movieCategory (movieCategoryMID, movieCategoryCID) VALUES (?, ?)",
              [insertMovie.insertId, insertNewCategory.insertId],
            );
          } else {
            await queryDatabase(
              "INSERT INTO movieCategory (movieCategoryMID, movieCategoryCID) VALUES (?, ?)",
              [insertMovie.insertId, checkCategory[0].categoryId],
            );
          }
        }

        // Sätter in cast & crew

        const getCredits = await fetch(
          `https://api.themoviedb.org/3/movie/${tmdbId}/credits?language=en-US`,
          apiKey,
        );
        const getCreditsResuls = await getCredits.json();

        let insertMovieJobPerson_sql =
          "INSERT INTO movieJobPerson (movieJobPersonPID, movieJobPersonJID, movieJobPersonMID) VALUES (?, ?, ?)";

        // Importerar skådespelarna
        for (let i = 0; i < getCreditsResuls.cast.length; i++) {
          let getPersonInfoF = await fetch(
            `https://api.themoviedb.org/3/person/${getCreditsResuls.cast[i].id}?language=en-US`,
            apiKey,
          );
          let getPersonInfo = await getPersonInfoF.json();
          let checkPersonIfExist = await queryDatabase(
            "SELECT personId FROM person WHERE persontmdbId = ?",
            getCreditsResuls.cast[i].id,
          );

          if (checkPersonIfExist.length !== 1) {
            let insertPerson_sql =
              "INSERT INTO person (personName, personBorn, personImg, persontmdbId) VALUES (?, ?, ?, ?)";
            let insertPerson = await queryDatabase(insertPerson_sql, [
              getPersonInfo.name,
              getPersonInfo.birthday,
              getPersonInfo.profile_path,
              getCreditsResuls.cast[i].id,
            ]);

            await queryDatabase(insertMovieJobPerson_sql, [
              insertPerson.insertId,
              2,
              insertMovie.insertId,
            ]);
          } else {
            await queryDatabase(insertMovieJobPerson_sql, [
              checkPersonIfExist[0].personId,
              2,
              insertMovie.insertId,
            ]);
          }
        }

        // Importerar crew
        for (let i = 0; i < getCreditsResuls.crew.length; i++) {
          let getPersonInfoF = await fetch(
            `https://api.themoviedb.org/3/person/${getCreditsResuls.crew[i].id}?language=en-US`,
            apiKey,
          );
          let getPersonInfo = await getPersonInfoF.json();

          let checkIfJobExist = await queryDatabase(
            "SELECT jobId FROM job WHERE jobTitle = ?",
            getCreditsResuls.crew[i].job,
          );

          let currentJobId;

          if (checkIfJobExist.length === 0) {
            let insertNewJob = await queryDatabase(
              "INSERT INTO job (jobTitle) VALUES (?)",
              getCreditsResuls.crew[i].job,
            );
            currentJobId = insertNewJob.insertId;
          } else {
            currentJobId = checkIfJobExist[0].jobId;
          }

          let checkPersonIfExist = await queryDatabase(
            "SELECT personId FROM person WHERE persontmdbId = ?",
            getCreditsResuls.crew[i].id,
          );
          if (checkPersonIfExist.length !== 1) {
            let insertPerson_sql =
              "INSERT INTO person (personName, personBorn, personImg, persontmdbId) VALUES (?, ?, ?, ?)";
            let insertPerson = await queryDatabase(insertPerson_sql, [
              getPersonInfo.name,
              getPersonInfo.birthday,
              getPersonInfo.profile_path,
              getCreditsResuls.crew[i].id,
            ]);

            await queryDatabase(insertMovieJobPerson_sql, [
              insertPerson.insertId,
              currentJobId,
              insertMovie.insertId,
            ]);
          } else {
            await queryDatabase(insertMovieJobPerson_sql, [
              checkPersonIfExist[0].personId,
              currentJobId,
              insertMovie.insertId,
            ]);
          }
        }

        // res.json(insertMovie.insertId);
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

// delete movie by id
exports.deleteMovie = async (req, res) => {
  const { id } = req.params;
  let sql = "DELETE FROM movie WHERE movieId = ?";

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
