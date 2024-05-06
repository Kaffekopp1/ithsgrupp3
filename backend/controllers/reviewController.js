const ReviewModel = require("../models/reviewModel");

exports.createReview = async (req, res) => {
  const { reviewerName, reviewComment, reviewRating, reviewMovieId } = req.body;
  if (reviewRating >= 0 && reviewRating <= 10) {
    try {
      const newReview = new ReviewModel({
        reviewerName: reviewerName,
        reviewComment: reviewComment,
        reviewRating: reviewRating,
        reviewMovieId: reviewMovieId
      });
      const insertedReview = await newReview.save();
      if (insertedReview) {
        return res.status(201).json({ msg: "Thanks for your review!" });
      } else {
        return res.status(500).json({
          msg: "Something went wrong"
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: error.message
      });
    }
  } else {
    return res.status(400).json({
      msg: "Your rating needs to be between 0-10"
    });
  }
};

exports.deleteReview = async (req, res) => {
  const { reviewId } = req.body
  try {
    const deletedReview = await ReviewModel.deleteOne({ id: reviewId })
    return res.status(200).json(deletedReview)
  } catch (error) {
    return res.status(500).json({
      error: error.message
    })
  }
}

exports.getReview = async (req, res) => {
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
};
