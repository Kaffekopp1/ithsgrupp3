const ReviewModel = require("../models/reviewModel");

exports.createReview = async (req, res) => {
	console.log("hej", req.body.movieId);
	const { reviewerName, reviewComment, reviewRating, reviewMovieId } = req.body;
	console.log(reviewerName, reviewComment, reviewRating, reviewMovieId);
	try {
		const newReview = new ReviewModel({
			reviewerName: reviewerName,
			reviewComment: reviewComment,
			reviewRating: reviewRating,
			reviewMovieId: reviewMovieId
		});
		const insertedReview = await newReview.save();
		return res.status(201).json(insertedReview);
	} catch (error) {
		return res.status(500).json({
			error: error.message
		});
	}
};

exports.getReview = async (req, res) => {
	console.log("hej", req.params.movieId);
	try {
		const movieReview = await ReviewModel.find({
			reviewMovieId: req.params.movieId
		});
		return res.status(200).json(movieReview);
	} catch (error) {
		return res.status(500).json({
			error: error.message
		});
	}
};

exports.getReviewAvg = async (req, res) => {
	console.log("getReviewAvg", req.params.movieId);
	let movieId = Number(req.params.movieId);
	try {
		const movieReviewavg = await ReviewModel.aggregate([
			{
				$match: { reviewMovieId: movieId }
			},
			{
				$group: {
					_id: "$reviewMovieId",
					avgAmount: { $avg: "$reviewRating" }
				}
			}
		]);
		return res.status(200).json(movieReviewavg);
	} catch (error) {
		return res.status(500).json({
			error: error.message
		});
	}
	res.send("getReviewAvg");
};
