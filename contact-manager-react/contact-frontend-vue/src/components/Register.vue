<template>
  <form @submit.prevent="handleSubmit">
    <h2>Register</h2>

    <div>
      <label>Name:</label>
      <input v-model="form.name" required />
    </div>

    <div>
      <label>Email:</label>
      <input type="email" v-model="form.email" required />
    </div>

    <div>
      <label>Password:</label>
      <input type="password" v-model="form.password" required />
    </div>

    <button type="submit">Register</button>
    <p v-if="message">{{ message }}</p>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'

const form = reactive({
  name: '',
  email: '',
  password: ''
})

const message = ref('')

const handleSubmit = async () => {
  try {
    const res = await axios.post('http://localhost:5000/register', form)
    message.value = res.data.message || 'Registered successfully!'
  } catch (err) {
    message.value = err.response?.data?.message || 'Registration failed.'
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
