const {
	connectionMySQL,
	queryDatabase,
	apiKey
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
			error: e.message
		});
	}
};

// get all movies from a specic act
exports.getActorWithmovie = async (req, res) => {
	const { actorId } = req.params;
	let sql =
		"SELECT JSON_ARRAYAGG(JSON_OBJECT( 'movieName', movieName, 'movieYear', movieYear, 'movieId', movieId, 'movieDescription', movieDescription, 'jobTitle', jobTitle, 'jobId', jobId,'moviePoster', moviePoster)) as movies,JSON_OBJECT('personName', personName, 'personBorn', personBorn, 'personImg',personImg) as actor from movie JOIN movieJobPerson mJP on movie.movieId = mJP.movieJobPersonMID JOIN job on mJP.movieJobPersonJID = job.jobId JOIN person p on p.personId = mJP.movieJobPersonPID where p.personId = ?";
	try {
		const actorWithmovies = await queryDatabase(sql, Number(actorId));
		res.json(actorWithmovies);
	} catch (e) {
		return res.status(500).json({
			error: e.message
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
			error: e.message
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
			error: "Du har inte skrivit in något ID för personen du vill radera!"
		});
	}
	try {
		const deletePerson = await queryDatabase(sql, id);
		return res.status(200).json({
			success: true,
			error: "",
			message: "Personen är raderad!"
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: error.message
		});
	}
};

// lägg till jobbtitle
exports.addJobbTitle = async (req, res) => {
	const { jobb } = req.body;
	let sql = "INSERT INTO job (jobTitle) VALUES (?)";
	try {
		await queryDatabase(sql, jobb);
		return res.status(201).json({
			success: true,
			error: "",
			message: "jobbTitle inlaggt!"
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: error.message
		});
	}
};

exports.addMovieToPerson = async (req, res) => {
	let sql =
		"INSERT INTO movieJobPerson (movieJobPersonPID,movieJobPersonJID,movieJobPersonMID) VALUES(?,?,?)";
	const { personId, jobbId, movieId } = req.body;

	try {
		await queryDatabase(sql, [personId, jobbId, movieId]);
		return res.status(201).json({
			success: true,
			error: "",
			message: "movie inlagt!"
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: error.message
		});
	}
};

exports.getJobTitle = async (req, res) => {
	try {
		const jobTitle = await queryDatabase("SELECT * FROM job");
		res.json(jobTitle);
	} catch (e) {
		return res.status(500).json({
			error: e.message
		});
	}
};

exports.changeChangeName = async (req, res) => {
	const { personName, personId } = req.params;
	let personIdN = Number(personId);
	try {
		const personNameres = await queryDatabase(
			"UPDATE person set personName = ?  WHERE personId = ?",
			[personName, personIdN]
		);
		res.json(personNameres);
	} catch (e) {
		return res.status(500).json({
			error: e.message
		});
	}
};

exports.deleteMovieFromPerson = async (req, res) => {
	const { personId, jobId, movieId } = req.body;
	let sql =
		"DELETE FROM movieJobPerson WHERE movieJobPersonPID = '?' AND movieJobPersonJID = '?' AND movieJobPersonMID = '?'";
	try {
		await queryDatabase(sql, [
			Number(personId),
			Number(jobId),
			Number(movieId)
		]);
		return res.status(200).json({
			success: true,
			error: "",
			message: "Filmen borttagen ifrån personen"
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: error.message
		});
	}
};
