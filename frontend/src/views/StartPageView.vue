<script setup>
import { ref, onMounted } from 'vue';

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

// onMounted(getMovies);
getMovies();
</script>
<template>
  <b-container fluid="lg" class="mt-2">
    <b-row>
      <b-col class="d-flex flex-column" style="border: 1px solid black;">
        <ul v-if="movieDataV" class="d-flex flex-row gap-1 flex-wrap">
          <li v-for="movie in movieDataV" class="w-25">
            <img :src="'https://image.tmdb.org/t/p/w500' + movie.moviePoster" alt="" class="img-fluid">
            <p>{{ movie.movieName }}</p>
          </li>
        </ul>
        <div class="text-center mb-3" v-else>
          <b-spinner class="color-text-custom" label="Loading..."></b-spinner>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>
