<script setup>
import { ref } from vue

const movieDataV = ref(null)

const getMovies = async () => {
  try {
    const movies = await fetch('http://localhost:3000/api/movies/10');

    const movieData = await movies.json();

    movieDataV.value = movieData;
  } catch (e) {
    console.log(".a.")
  } finally {
  }
}

</script>

<template>



</template>
