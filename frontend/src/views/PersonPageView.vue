<script setup>
import { useRoute } from "vue-router";
import { ref } from "vue";
const personArr = ref([]);

const route = useRoute();
console.log(route.params.personId);

async function getPerson() {
	try {
		let response = await fetch(
			`http://127.0.0.1:3000/api/actorWithmovie/${route.params.personId}`
		);
		let data = await response.json();
		console.log("data", data);
		personArr.value = data;
	} catch (error) {
		console.log("error");
	}
}
getPerson();
</script>
<template>
	<div class="personContainer">
		<h1>hej</h1>
		{{ personArr }}
		<div v-for="person in personArr">
			<div class="movieContainer">
				{{ person.movieName }}
				{{ person.movieYear }}
			</div>
		</div>
	</div>
</template>

<style scoped>
.personContainer {
	display: flex;
	flex-direction: column;
	margin: 10px;
}
.movieContainer {
	margin: 10px;
}
</style>
