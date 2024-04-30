<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const movieDataV = ref(null)
const router = useRouter()

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

const goToMovie = (id) => {
  router.push('/movie/' + id)
}

getMovies();
</script>
<template>
  <b-container fluid="lg" class="d-flex flex-column mt-2 gap-4">
    <h4 class="mb-6">FILMER 🎬 📹🎥 📽️</h4>
    <b-row v-if="movieDataV" cols="2" cols-sm="3" cols-md="4" cols-lg="6">
      <b-col class="d-flex flex-column" v-for="movie in movieDataV">
        <div @click="goToMovie(movie.movieId)" class="movie-container">
          <div class="img-wrapper">
            <img :src="'https://image.tmdb.org/t/p/w300' + movie.moviePoster" alt="" class="img-fluid">
          </div>
          <p class="fs">{{ movie.movieName }} ({{ movie.movieYear }})</p>
        </div>
      </b-col>
    </b-row>
    <div class="text-center mb-3" v-else>
      <b-spinner class="color-text-custom" label="Loading..."></b-spinner>
    </div>
  </b-container>
</template>
<style scoped>
ul {
  list-style-type: none;
}

.movie-container:hover {
  cursor: pointer;
}

.img-wrapper {
  max-width: 191px;
}
</style>
