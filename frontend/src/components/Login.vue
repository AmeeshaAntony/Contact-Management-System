<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="loginUser">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async loginUser() {
      try {
        // Send login request to backend
        const response = await axios.post('http://localhost:5000/login', {
          email: this.email,
          password: this.password
        });

        if (response.status === 200) {
          // Handle success - you can save the user_id or any token
          console.log('Login successful:', response.data);
          localStorage.setItem('user_id', response.data.user_id);  // Store user_id in local storage

          // Optionally, you can redirect to another page or show a success message
          this.$router.push('/dashboard');  // Assuming you have a route called 'dashboard'
        }
      } catch (error) {
        // Handle error (e.g., invalid credentials)
        if (error.response) {
          this.errorMessage = error.response.data.error;
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
        }
        console.error('Login error:', error.response ? error.response.data : error.message);
      }
    }
  }
};
</script>
