<script setup>
import { ref } from "vue"
import { useRoute } from "vue-router"

const router = useRoute()
const movieId = router.params.movieId
const movieData1 = ref(null)
const reviewData = ref(null)
const personId = router.params.personId

const getMovieData = async () => {
  try {
    const movies = await fetch(`http://localhost:3000/api/specificMovie/${movieId}`);

    const movieData = await movies.json();

    movieData1.value = movieData[0];

    console.log(personId)
    
  } catch (e) {
  } 
}

const getReviews = async () => {
  try {
    const reviews = await fetch(`http://localhost:3000/api/reviews/getreviews/${movieId}`)
    
    const review = await reviews.json()
    
    reviewData.value = review
    console.log(reviewData)

  } catch (error) {
  }
}

getMovieData()
getReviews()

</script>

<template>
<main>
<h1> {{ movieData1.movieName }} </h1>
<img :src="'https://image.tmdb.org/t/p/w500' + movieData1.moviePoster"> 
<Router-link to="/"><b-button variant="outline-dark">Back</b-button></Router-link>
<hr>
<p> Year : {{ movieData1.movieYear }} </p>
<p> Runtime : {{ movieData1.movieRuntime }} </p>
<hr>
<h6> Categories : </h6>
<li v-for="category in movieData1.categories"> {{ category }} </li>
<hr>
<div class="reviews-container">
<h6>Reviews</h6>
<div class="review-container" v-for="review in reviewData">

<p> Name : {{ review.reviewerName }} </p>
<p> Rating : {{ review.reviewRating }}</p>
<p> Comment : {{ review.reviewComment }} </p>

</div>
</div>
<div class="cast-container">
<h5>Cast :</h5>

<li v-for="cast in movieData1.cast"> 
<Router-link :to="{ name: 'person', params: { personId: cast.personId } }"> {{ cast.jobTitle }} : {{ cast.personName }}
</Router-link>
</li>

</div>
</main>
</template>

<style scoped>

main {
width: 100%;
display: flex;
flex-direction: column;
margin: 20px; 
align-items: center;
}

img {
  max-width: 350px;  
}

.reviews-container {
  border: 10px solid red;
  padding: 15px;
  box-shadow: 20px 20px;
}

</style>