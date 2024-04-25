const {
	connectionMySQL,
	queryDatabase,
	apiKey,
} = require("../connectionMySQL");

// Importera film
exports.importMovie = async (req, res) => {
	try {
		const { tmdbId } = req.params;
		if (tmdbId) {
			const getMovieInformation = await fetch(
				`https://api.themoviedb.org/3/movie/${tmdbId}?language=en-US`,
				apiKey
			);
			const getMovieResults = await getMovieInformation.json();

			if (getMovieResults.success !== false) {
				const insertMovie_sql =
					"INSERT INTO movie (movieName, movieYear, movieDescription, moviePoster, movieRuntime, movietmdbId) VALUES (?, ?, ?, ?, ?, ?)";
				const convertedYear = new Date(
					getMovieResults.release_date
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
						getMovieResults.genres[i].name
					);

					if (checkCategory.length === 0) {
						let insertNewCategory = await queryDatabase(
							"INSERT INTO category (categoryName) VALUES (?)",
							getMovieResults.genres[i].name
						);
						await queryDatabase(
							"INSERT INTO movieCategory (movieCategoryMID, movieCategoryCID) VALUES (?, ?)",
							[insertMovie.insertId, insertNewCategory.insertId]
						);
					} else {
						await queryDatabase(
							"INSERT INTO movieCategory (movieCategoryMID, movieCategoryCID) VALUES (?, ?)",
							[insertMovie.insertId, checkCategory[0].categoryId]
						);
					}
				}

				// Sätter in cast & crew

				const getCredits = await fetch(
					`https://api.themoviedb.org/3/movie/${tmdbId}/credits?language=en-US`,
					apiKey
				);
				const getCreditsResuls = await getCredits.json();

				let insertMovieJobPerson_sql =
					"INSERT INTO movieJobPerson (movieJobPersonPID, movieJobPersonJID, movieJobPersonMID) VALUES (?, ?, ?)";

				// Importerar skådespelarna
				for (let i = 0; i < getCreditsResuls.cast.length; i++) {
					let getPersonInfoF = await fetch(
						`https://api.themoviedb.org/3/person/${getCreditsResuls.cast[i].id}?language=en-US`,
						apiKey
					);
					let getPersonInfo = await getPersonInfoF.json();
					let checkPersonIfExist = await queryDatabase(
						"SELECT personId FROM person WHERE persontmdbId = ?",
						getCreditsResuls.cast[i].id
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
						apiKey
					);
					let getPersonInfo = await getPersonInfoF.json();

					let checkIfJobExist = await queryDatabase(
						"SELECT jobId FROM job WHERE jobTitle = ?",
						getCreditsResuls.crew[i].job
					);

					let currentJobId;

					if (checkIfJobExist.length === 0) {
						let insertNewJob = await queryDatabase(
							"INSERT INTO job (jobTitle) VALUES (?)",
							getCreditsResuls.crew[i].job
						);
						currentJobId = insertNewJob.insertId;
					} else {
						currentJobId = checkIfJobExist[0].jobId;
					}

					let checkPersonIfExist = await queryDatabase(
						"SELECT personId FROM person WHERE persontmdbId = ?",
						getCreditsResuls.crew[i].id
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
