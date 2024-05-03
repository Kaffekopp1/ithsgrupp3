<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
let userName = ref("");
let password = ref("");

async function login() {
	console.log("hej");
	let body = {
		username: userName.value,
		password: password.value
	};
	try {
		let response = await fetch("http://127.0.0.1:3000/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body)
		});
		console.log("response", response);
		if (response.ok) {
			let data = await response.json();
			console.log("data", data);
			localStorage.setItem("token", data.token);
			router.push("/");
		} else {
			console.log("ve och fasa");
		}
	} catch (error) {
		console.log("error", error);
	}
}
function test() {
	let token = localStorage.getItem("token");
	console.log("test", token);
}
</script>

<template>
	<h1>Login</h1>
	<div>
		{{ userName }}
		{{ password }}
		<input type="email" v-model="userName" placeholder="userName" />
		<input type="password" v-model="password" placeholder="Password" />
		<button @click="login">Login</button>
		<button @click="test">tete</button>
	</div>
</template>
