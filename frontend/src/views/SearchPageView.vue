<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

const keyword = ref(route.params.keyword);
const SearchArr = ref(null);

async function getSearchResults() {
  try {
    const getSearch = await fetch(`http://localhost:3000/api/searcher/${keyword.value}`);
    const getAllResults = await getSearch.json();
    SearchArr.value = getAllResults[0];
  } catch {

  }
}

const goToURL = (id, type) => {
  router.push(`/${type}/${id}`)
}

watch(
  () => route.params.keyword,
  (newKeyword, oldKetword) => {
    keyword.value = newKeyword;
    getSearchResults();
  }
);

getSearchResults();
</script>

<template>
  <b-container fluid="lg" class="d-flex flex-column mt-2 gap-4">
    <h4 class="mb-6">Sökresultat för {{ keyword }} 🎬 📹🎥 📽️</h4>
    <b-row v-if="SearchArr" cols="2" cols-sm="3" cols-md="4" cols-lg="6">
      <b-col class="d-flex flex-column" v-for="searchArr in SearchArr">
        <div @click="goToURL(searchArr.id, searchArr.type)" class="movie-container">
          <div class="img-wrapper">
            <img :src="'https://image.tmdb.org/t/p/w300' + searchArr.poster" alt="" class="img-fluid"
              v-if="searchArr.poster">
            <img src="https://placehold.co/200x300/212529/FFF?text=?" alt="" class="img-fluid" v-else>
          </div>
          <p class="fs">{{ searchArr.name }}</p>
        </div>
      </b-col>
      <div v-if="SearchArr.length === 0">
        <p>No results found 👺 👺 👺 </p>
      </div>
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
