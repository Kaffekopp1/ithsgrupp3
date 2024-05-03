<script setup>
import { useRoute } from "vue-router";
import { watch, ref } from "vue";
const personArr = ref([]);
const personMovies = ref([]);
const ActorInput = ref("");
const ActorSeachedoutput = ref([]);
const test = ref({});
const route = useRoute();
const personId = ref(route?.params?.personId);
const showSearch = ref(false);
console.log(route.params.personId);

async function getPerson() {
	try {
		let response = await fetch(
			`http://127.0.0.1:3000/api/actorWithmovie/${personId.value}`
		);
		let data = await response.json();

		personMovies.value = data[0].movies;
		personArr.value = data[0].actor;
		console.log(data);
	} catch (error) {
		console.log("error", error);
	}
}
getPerson();

async function searchActor() {
	try {
		let response = await fetch(
			`http://127.0.0.1:3000/api/actor/${ActorInput.value}`
		);
		if (response.ok) {
			let data = await response.json();
			ActorSeachedoutput.value = data;
			showSearch.value = true;
		} else {
			ActorSeachedoutput.value = [];
		}
	} catch (error) {
		console.log("error", error);
	}
}

watch(
	() => route.params.personId,
	(newPersonId, oldPersonId) => {
		personId.value = newPersonId;
		ActorSeachedoutput.value = [];
		ActorInput.value = "";
		showSearch.value = false;
		getPerson();
	}
);
</script>
<template>
	<!-- search -->
	<div class="searchDiv" columns v-if="showSearch">
		<button @click="showSearch = !showSearch">close</button>
		<b-card-group class="searchDiv2">
			<b-card
				v-for="actor in ActorSeachedoutput"
				:header="actor.personName"
				tag="article"
				style="max-width: 15rem; min-height: 600px; min-width: 15rem"
				class="mb-2">
				<b-card-img
					v-if="actor.personIMG"
					:src="`https://image.tmdb.org/t/p/w500${actor.personIMG}`"
					alt="Image"
					top></b-card-img>
				<b-card-img
					v-else
					:src="`https://placehold.co/200x300/212529/FFF?text=?`"
					alt="Image"
					top></b-card-img>
				<div v-for="movie in actor?.movies">
					{{ movie.movieName }}
				</div>
				<router-link
					:to="{ name: 'person', params: { personId: actor.personId } }">
					Go to: {{ actor.personName }}
				</router-link>
			</b-card>
		</b-card-group>
	</div>
	<b-container>
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

		<div
			class="d-flex justify-content-center align-items-center flex-column"
			v-if="personArr?.personName">
			<h1>{{ personArr.personName }}</h1>
			<img
				style="max-width: 20rem"
				:src="`https://image.tmdb.org/t/p/w500${personArr.personImg}`" />
			<p>
				{{ personArr.personBorn }}
			</p>
			<p>Filmer med {{ personArr.personName }}:</p>
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

		<div v-else>
			<h1>Hittade Ingen skådespelare med det namnet</h1>
		</div>
	</b-container>
</template>

<style scoped>
.searchDiv {
	position: absolute;
	background-color: aliceblue;
	padding: 20px;
	z-index: 20;
	min-width: 80%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-left: auto;
	margin-right: auto;
	left: 0;
	right: 0;
}

.personContainer {
	border: dotted;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	padding: 10px;
	margin: 10px;
	border-radius: 10px;
}

.movieContainer {
	margin: 10px;
}
</style>
