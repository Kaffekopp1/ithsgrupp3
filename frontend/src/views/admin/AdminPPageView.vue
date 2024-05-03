<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const personId = ref(route?.params?.personId);
console.log("hej", personId.value);
const personArr = ref([]);
const personMovies = ref([]);
const movieSeachedoutput = ref();
const movieSeacheInput = ref();
const Nname = ref("");
const selected = ref("");
const categorys = ref([]);

async function getPerson() {
	try {
		let response = await fetch(
			`http://127.0.0.1:3000/api/actorWithmovie/${route.params.personId}`
		);
		let data = await response.json();

		personMovies.value = data[0].movies;
		personArr.value = data[0].actor;
		console.log(data);
	} catch (error) {
		console.log("error", error);
	}
}
function test() {
	console.log("test", movieSeachedoutput.value);
}
async function changeName() {
	try {
		let response = await fetch(
			`http://127.0.0.1:3000/api/changeChangeName/${Nname.value}/${route.params.personId}`
		);
		let data = await response.json();
		console.log(data);
	} catch (error) {
		console.log("error", error);
	}
}

async function getCategory() {
	try {
		let response = await fetch(`http://127.0.0.1:3000/api/jobtitles/`);
		let data = await response.json();
		console.log(data);
		categorys.value = data;
	} catch (error) {
		console.log("error", error);
	}
}

async function searchMovie() {
	try {
		let response = await fetch(
			`http://127.0.0.1:3000/api/movies/search/${movieSeacheInput.value}/10`
		);
		if (response.ok) {
			let data = await response.json();
			console.log("data", data);
			let withCategory = data.map((movie) => {
				movie["category"] = categorys.value;
				movie["selectedCategory"] = "";
				console.log("categ", movie, categorys.value);
				return movie;
			});
			// console.log("l", l);
			movieSeachedoutput.value = withCategory;
			// showSearch.value = true;
		} else {
			movieSeachedoutput.value = [];
		}
	} catch (error) {
		console.log("error", error);
	}
}
async function addMovieToPerson(moviein) {
	console.log(
		"hej",
		moviein.movieId,
		Number(personId.value),
		moviein.selectedCategory.jobId
	);
	let body = {
		personId: Number(personId.value),
		jobbId: moviein.selectedCategory.jobId,
		movieId: moviein.movieId
	};
	console.log(body);
	try {
		let response = await fetch(`http://127.0.0.1:3000/api/addMovieToPerson`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body)
		});
		console.log("response", response);
		if (response.ok) {
			let data = await response.json();
			console.log("data");
		} else {
			console.log("hejsan");
		}
	} catch (error) {
		console.log("error", error);
	}
}

getPerson();
getCategory();
</script>
<template setup>
	<div
		class="d-flex justify-content-center align-items-center flex-column"
		v-if="personArr?.personName">
		<h1>Admin för {{ personArr?.personName }}</h1>
		<input type="text" v-model="Nname" />
		{{ Nname }}
		<button @click="changeName">change name</button>
		<img
			style="max-width: 20rem"
			:src="`https://image.tmdb.org/t/p/w500${personArr.personImg}`" />
		<p>
			{{ personArr.personBorn }}
		</p>
		<p>Filmer med {{ personArr.personName }}:</p>
		<div>Lägg till film</div>
		<div>
			<b-form-input
				class="mr-sm-1"
				placeholder="Sök efter en film att lägga till"
				v-model="movieSeacheInput"
				required></b-form-input>
			<b-button
				variant="primary"
				class="my-2 my-sm-0"
				type="submit"
				@click="searchMovie()"
				>Sök</b-button
			>
			<div v-for="(movie, index) in movieSeachedoutput" :key="index">
				{{ movie.movieName }} {{ movie.movieYear }}
				<select v-model="movie.selectedCategory">
					<option value="">Välj yrke</option>
					<option
						v-for="(category, cindex) in movie.category"
						:value="category"
						:key="cindex">
						{{ category.jobTitle }}
					</option>
				</select>
				<button @click="addMovieToPerson(movie)">Lägg till film</button>
				<button @click="test">test</button>
			</div>
		</div>

		<b-card-group>
			<b-card
				v-for="movie in personMovies"
				:title="movie.movieName"
				img-alt="Image"
				:img-src="`https://image.tmdb.org/t/p/w500${movie.moviePoster}`"
				img-top
				tag="article"
				style="max-width: 20rem"
				class="mb-2">
				<b-card-text>
					<p>{{ movie.movieyear }}</p>
					{{ movie.movieDescription }}
				</b-card-text>
				<router-link
					:to="{ name: 'movie', params: { movieId: movie.movieId } }">
					Go to: {{ movie.movieName }}
				</router-link>
			</b-card>
		</b-card-group>
	</div>
</template>
<style scoped></style>
