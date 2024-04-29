const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
	reviewerName: {
		type: String,
		required: true
	},
	reviewComment: {
		type: String,
		required: true
	},
	reviewRating: {
		type: Number,
		required: true
	},
	reviewMovieId: {
		type: Number,
		required: true
	}
});

module.exports = mongoose.model("review", ReviewSchema);
