<script setup>
import { useRoute } from "vue-router";
import { ref } from "vue";
const personArr = ref([]);
const personMovies = ref([]);
const ActorInput = ref("");
const ActorSeachedoutput = ref([]);
const test = ref({});

const route = useRoute();
console.log(route.params.personId);

async function getPerson() {
	try {
		let response = await fetch(
			`http://127.0.0.1:3000/api/actorWithmovie/${route.params.personId}`
		);
		let data = await response.json();

		personMovies.value = JSON.parse(data[0].movies);
		personArr.value = JSON.parse(data[0].actor);
		console.log(data);
	} catch (error) {
		console.log("error", error);
	}
}
getPerson();

function parseData() {
	let actorTempArr = ActorSeachedoutput.value;

	for (let i = 0; i < actorTempArr.length; i++) {
		console.log(actorTempArr[i].movies);
		actorTempArr[i].movies = JSON.parse(actorTempArr[i].movies);
	}
	ActorSeachedoutput.value = actorTempArr;
}

async function searchActor() {
	console.log("search", ActorInput.value);

	try {
		let response = await fetch(
			`http://127.0.0.1:3000/api/actor/${ActorInput.value}`
		);
		let data = await response.json();

		let actorTempArr = data;

		for (let i = 0; i < actorTempArr.length; i++) {
			console.log(actorTempArr[i].movies);
			actorTempArr[i].movies = JSON.parse(actorTempArr[i].movies);
		}
		ActorSeachedoutput.value = actorTempArr;
	} catch (error) {
		console.log("error", error);
	}
}
</script>
<template>
	<b-container>
		<button @click="parseData">test</button>
		<div>
			<b-form-input
				class="mr-sm-1"
				placeholder="Sök efter en skådespelare"
				v-model="ActorInput"
				required></b-form-input>
			<b-button
				variant="primary"
				class="my-2 my-sm-0"
				type="submit"
				@click="searchActor()"
				>Sök</b-button
			>
		</div>

		<div v-for="actor in ActorSeachedoutput">
			{{ actor }}
			<div v-for="movie in actor?.movies">
				<!-- {{ typeof movie }} -->
			</div>
		</div>
		{{ ActorSeachedoutput }}
		<div class="personContainer" v-if="personArr?.personName">
			<h1>{{ personArr.personName }}</h1>
			<b-card-group deck>
				<b-card
					v-for="movie in personMovies"
					:title="movie.movieName"
					img-alt="Image"
					:img-src="`https://image.tmdb.org/t/p/w500${movie.moviePoster}`"
					sub-title="movie.movieName"
					img-top
					tag="article"
					style="max-width: 20rem"
					class="mb-2"
					>{{ movie }}
					<b-card-text>
						{{ movie.movieDescription }}
					</b-card-text>

					<b-button href="#" variant="primary">Go somewhere</b-button>
				</b-card>
			</b-card-group>
		</div>

		<div v-else>
			<h1>Hittade Ingen skådespelare med det namnet</h1>
		</div>
	</b-container>
</template>

<style scoped>
.movieContainer {
	margin: 10px;
}
</style>
