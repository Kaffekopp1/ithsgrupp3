<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const router = useRoute();
const movieId = router.params.movieId;
const movieData1 = ref(null);
const reviewData = ref(null);

const getMovieData = async () => {
	try {
		const movies = await fetch(
			`http://localhost:3000/api/specificMovie/${movieId}`
		);
		const movieData = await movies.json();
		movieData1.value = movieData[0];
	} catch (e) {}
};

const getReviews = async () => {
	try {
		const reviews = await fetch(
			`http://localhost:3000/api/reviews/getreviews/${movieId}`
		);

		const review = await reviews.json();

		reviewData.value = review;
		console.log(reviewData);
	} catch (error) {}
};

const reviewerName = ref(null);
const reviewComment = ref(null);
const reviewRating = ref(null);
const message = ref(null);

async function postReview(event) {
	event.preventDefault();
	const response = await fetch(
		"http://localhost:3000/api/reviews/createReview",
		{
			method: "POST",
			mode: "cors",
			cache: "no-cache",
			credentials: "same-origin",
			headers: {
				"Content-Type": "application/json"
			},
			redirect: "follow",
			referrerPolicy: "no-referrer",
			body: JSON.stringify({
				reviewerName: reviewerName.value,
				reviewComment: reviewComment.value,
				reviewRating: reviewRating.value,
				reviewMovieId: movieId
			}) // body data type must match "Content-Type" header
		}
	);
	if (response.ok) {
		message.value = true;
		getReviews();
		reviewerName.value = "";
		reviewComment.value = "";
		reviewRating.value = "";
	}
	return response.json();
}
</script>

<template>
	<main>
		<div class="mega-container" v-if="movieData1?.movieName">
			<div class="top-container">
				<h1>{{ movieData1.movieName }}</h1>
				<img
					:src="'https://image.tmdb.org/t/p/w500' + movieData1.moviePoster" />
				<hr />
				<p>Year : {{ movieData1.movieYear }}</p>
				<p>Runtime : {{ movieData1.movieRuntime }}</p>
				<Router-link to="/"
					><b-button variant="outline-dark"
						>Back to Startpage</b-button
					></Router-link
				>
				<hr />
			</div>
			<div class="form">
				<div class="message" v-if="message">Thanks for your review!</div>
				<form method="POST" id="reviewForm">
					Name: <input type="text" v-model="reviewerName" /> Comment:
					<input type="text" v-model="reviewComment" /> Rating:
					<input type="number" v-model="reviewRating" />
					<input
						id="submit"
						type="submit"
						value="Send Review"
						@click="postReview" />
				</form>
			</div>
			<div class="outer-container">
				<h6>Categories :</h6>
				<li v-for="category in movieData1.categories">{{ category }}</li>
				<hr />
				<div class="reviews-container">
					<h6>Reviews</h6>
					<div class="review-container" v-for="review in reviewData">
						<p>Name : {{ review.reviewerName }}</p>
						<p>Rating : {{ review.reviewRating }}</p>
						<p>Comment : {{ review.reviewComment }}</p>
					</div>
				</div>

				<div class="cast-container">
					<h5>Cast :</h5>
					<li v-for="cast in movieData1.cast">
						<Router-link
							:to="{ name: 'person', params: { personId: cast.personId } }">
							{{ cast.jobTitle }} : {{ cast.personName }}
						</Router-link>
					</li>
				</div>
			</div>
		</div>
	</main>
</template>

<style scoped>
main {
	width: 100%;
	margin: 20px;
}

.top-container {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.form {
	margin: 20px;
}

#submit {
	margin-top: 20px;
}

.outer-container {
	margin: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
}

img {
	max-width: 350px;
}

h6 {
	border-bottom: solid black 2px;
}

.reviews-container {
	border: 10px solid red;
	padding: 15px;
	box-shadow: 20px 20px;
	margin: 20px;
}

.review-container {
	border-bottom: solid black 1px;
}

.cast-container {
  overflow-y: scroll; height:400px;
}

</style>
