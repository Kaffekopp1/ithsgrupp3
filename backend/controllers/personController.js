const {
  connectionMySQL,
  queryDatabase,
  apiKey,
} = require("../connectionMySQL");

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
