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

const token = localStorage.getItem("token");
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
			`http://127.0.0.1:3000/api/changeChangeName/${Nname.value}/${route.params.personId}`,
			{
				headers: { Authorization: `${token}` },
				method: "PUT"
			}
		);
		let data = await response.json();
		getPerson();
		console.log(data);
	} catch (error) {
		console.log("error", error);
	}
}

async function getCategory() {
	try {
		let response = await fetch(`http://127.0.0.1:3000/api/jobtitles/`);
		let data = await response.json();
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
			let withCategory = data.map((movie) => {
				movie["category"] = categorys.value;
				movie["selectedCategory"] = "";
				return movie;
			});
			movieSeachedoutput.value = withCategory;
		} else {
			movieSeachedoutput.value = [];
		}
	} catch (error) {
		console.log("error", error);
	}
}
async function addMovieToPerson(moviein) {
	let body = {
		personId: Number(personId.value),
		jobbId: moviein.selectedCategory.jobId,
		movieId: moviein.movieId
	};
	try {
		let response = await fetch(`http://127.0.0.1:3000/api/addMovieToPerson`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `${token}`
			},
			body: JSON.stringify(body)
		});
		if (response.ok) {
			let data = await response.json();
			getPerson();
		} else {
			console.log("response icke ok");
		}
	} catch (error) {
		console.log("error", error);
	}
}
async function deleteMovieFromActor(movieId, jobbId) {
	let body = { movieId: movieId, jobId: jobbId, personId: personId.value };
	try {
		let response = await fetch(`http://127.0.0.1:3000/api/moviefromactor`, {
			method: "DELETE",

			headers: {
				"Content-Type": "application/json",
				Authorization: `${token}`
			},
			body: JSON.stringify(body)
		});
		getPerson();
		console.log("response", response);
	} catch (error) {
		console.log("error", error);
	}
}

getPerson();
getCategory();
</script>
<template setup>
	<div class="container">
		<div
			class="d-flex justify-content-center align-items-center flex-column"
			v-if="personArr?.personName">
			<h1>Admin för {{ personArr?.personName }}</h1>
			<input type="text" v-model="Nname" />
			{{ Nname }}
			<button @click="changeName">change name</button>
			<img
				v-if="personArr.personImg"
				style="max-width: 20rem"
				:src="`https://image.tmdb.org/t/p/w500${personArr.personImg}`"
				alt="Image"
				top />
			<img
				v-else
				style="max-width: 20rem"
				:src="`https://placehold.co/200x300/212529/FFF?text=?`"
				alt="Image"
				top />

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
				</div>
			</div>

			<b-card-group class="gap-2">
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
					<div class="d-flex flex-column gap-2">
						<button @click="deleteMovieFromActor(movie.movieId, movie.jobId)">
							Ta bort film från {{ personArr.personName }}
						</button>

						<router-link
							:to="{ name: 'movie', params: { movieId: movie.movieId } }">
							Go to: {{ movie.movieName }}
						</router-link>
					</div>
				</b-card>
			</b-card-group>
		</div>
	</div>
</template>
<style scoped></style>
