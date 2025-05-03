<template>
  <form @submit.prevent="handleLogin">
    <h2>Login</h2>

    <div>
      <label>Email:</label>
      <input v-model="form.email" type="email" required />
    </div>

    <div>
      <label>Password:</label>
      <input v-model="form.password" type="password" required />
    </div>

    <button type="submit">Login</button>
    <p v-if="message">{{ message }}</p>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'

const form = reactive({
  email: '',
  password: ''
})

const message = ref('')

const handleLogin = async () => {
  try {
    const res = await axios.post('http://localhost:5000/login', form)
    message.value = res.data.message || 'Login successful!'
    // optionally store token here if backend returns one
  } catch (err) {
    message.value = err.response?.data?.message || 'Login failed.'
  }
}
</script>

<style scoped>
form {
  max-width: 400px;
  margin: 20px auto;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
}
div {
  margin-bottom: 10px;
}
label {
  display: block;
}
input {
  width: 100%;
  padding: 8px;
}
</style>
