<script setup>
import { ref } from "vue"
import { useRoute } from "vue-router"

const router = useRoute()

const movieId = router.params.movieId

const movieData1 = ref(null)

const getMovieData = async () => {
  try {
    const movies = await fetch(`http://localhost:3000/api/specificMovie/${movieId}`);

    const movieData = await movies.json();

    movieData1.value = movieData[0];
    console.log(movieData)
  } catch (e) {
  } 
}

getMovieData()

</script>

<template>
<main>
<h1> {{ movieData1.movieName }} </h1>
<img :src="'https://image.tmdb.org/t/p/w500' + movieData1.moviePoster"> 
<Router-link to="/"><b-button variant="outline-dark">Back</b-button></Router-link>
<p> {{ movieData1.movieDescription }} </p>
<li v-for="actor in movieData1"> {{ actor.crew[0].jobTitle }} </li>
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

</style>