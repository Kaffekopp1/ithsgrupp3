<script setup>
import { ref } from 'vue'

const username = ref(null)
const password = ref(null)
const passwordConfirm = ref(null)
let success = ref(false)
let failure = ref(false)

async function registerNewUser(event) {
  event.preventDefault()
   const response = await fetch("http://localhost:3000/register", {
    method: 'POST',
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username.value,
      password: password.value
  })
})
if (response.ok) {
  success.value = true
  failure.value = false
  username.value = ""
  password.value = ""
  passwordConfirm.value = ""
}
else {
  failure.value = true
  success.value = false
}
}
</script>

<template>
<div class="register-form">
  <form method="post">
    Username: <input type="text" v-model="username">
    Password: <input type="password" v-model="password">
    <input type="submit" value="Register" @click="registerNewUser">
    <p v-if="success">A new user has been added!</p>
    <p v-if="failure">Something went wrong..</p>
    <RouterLink to="/login"><button>Login</button></RouterLink>
  </form>
</div>

</template>
