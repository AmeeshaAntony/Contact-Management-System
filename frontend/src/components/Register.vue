

<template>
  <div class="register">
    <h2>Register</h2>
    <form @submit.prevent="registerUser">
      <div>
        <label for="name">Name:</label>
        <input type="text" v-model="name" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <div>
        <label for="confirmPassword">Confirm Password:</label>
        <input type="password" v-model="confirmPassword" required />
      </div>
      <div>
        <button type="submit">Register</button>
      </div>
      <p>Already have an account? <router-link to="/login">Login</router-link></p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
    };
  },
  methods: {
  async registerUser() {
    try {
      const response = await axios.post('http://localhost:5000/register', {
        name: this.name,
        email: this.email,
        password: this.password
      });
      console.log('Registration successful:', response.data);
      this.$router.push('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  }
},
};
</script>

<style scoped>
/* Add styling as needed */
</style>
