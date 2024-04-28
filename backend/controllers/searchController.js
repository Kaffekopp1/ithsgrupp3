const {
	connectionMySQL,
	queryDatabase,
	apiKey
} = require("../connectionMySQL");

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
				error: "Inget resultat"
			});
		}
	} catch (error) {
		return res.status(500).json({
			error: error.message
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
			Number(amount)
		]);

		if (getMovieBySearch.length > 0) {
			res.json(getMovieBySearch);
		} else {
			res.json({
				error: "Inget resultat"
			});
		}
	} catch (error) {
		return res.status(500).json({
			error: error.message
		});
	}
};

// get all movies from specific actor by search
exports.getActorBySearch = async (req, res) => {
	const { actor } = req.params;
	let sql =
		" SELECT p.personId,p.personName, personIMG, JSON_ARRAYAGG( JSON_OBJECT( 'movieName', movieName, 'movieYear', movieYear, 'movieId', movieId )) AS movies FROM movie JOIN movieJobPerson mJP ON movie.movieId = mJP.movieJobPersonMID JOIN job j ON mJP.movieJobPersonJID = j.jobId JOIN person p ON mJP.movieJobPersonPID = p.personId WHERE p.personName LIKE CONCAT('%',?,'%') GROUP BY p.personId, p.personName LIMIT 10";
	try {
		const getActorArray = await queryDatabase(sql, actor);
		res.json(getActorArray);
	} catch (e) {
		return res.status(500).json({
			error: e.message
		});
	}
};

// search db after person, category and movie obs: only works if procedure "searcher" exists
exports.getFromSearch = async (req, res) => {
	const { keyword } = req.params;
	console.log("keyWord", keyword);
	let sql = "call searcher( ? )";
	try {
		const getSearchResult = await queryDatabase(sql, keyword);
		res.json(getSearchResult);
	} catch (e) {
		return res.status(500).json({
			error: e.message
		});
	}
};
