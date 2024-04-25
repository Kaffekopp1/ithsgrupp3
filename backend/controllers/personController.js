const {
	connectionMySQL,
	queryDatabase,
	apiKey,
} = require("../connectionMySQL");

// get all actors from a specific movie
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

// get all movies from a specic act
exports.getActorWithmovie = async (req, res) => {
	const { actorId } = req.params;
	let sql =
		"select movieName, movieYear, movieId, movieDescription, moviePoster, personName, personBorn, personImg from movie join movieJobPerson mJP on movie.movieId = mJP.movieJobPersonMID join  person p on p.personId = mJP.movieJobPersonPID where movieJobPersonPID = ? ";
	try {
		const actorWithmovies = await queryDatabase(sql, Number(actorId));

		res.json(actorWithmovies);
	} catch (e) {
		return res.status(500).json({
			error: e.message,
		});
	}
};

// get all actors with limit
exports.getActors = async (req, res) => {
	const { amount } = req.params;
	try {
		const getPersonsArray = await queryDatabase(
			"SELECT * FROM person LIMIT ? ",
			Number(amount)
		);
		res.json(getPersonsArray);
	} catch (e) {
		return res.status(500).json({
			error: e.message,
		});
	}
};

// delete a actor
exports.deletePerson = async (req, res) => {
	const { id } = req.params;
	let sql = "CALL deletePerson( ? )";

	if (!id) {
		return res.status(400).json({
			success: false,
			error: "Du har inte skrivit in något ID för personen du vill radera!",
		});
	}
	try {
		const deletePerson = await queryDatabase(sql, id);

		return res.status(201).json({
			success: true,
			error: "",
			message: "Personen är raderad!",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};

// lägg till jobbtitle
exports.addJobbTitle = async (req, res) => {
	const { jobb } = req.body;
	console.log("jobb", jobb);
	let sql = "INSERT INTO job (jobTitle) VALUES (?)";
	try {
		const adderJobb = await queryDatabase(sql, jobb);
		console.log("adderJobb", adderJobb);
		return res.status(201).json({
			success: true,
			error: "",
			message: "jobbTitle inlaggt!",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};
