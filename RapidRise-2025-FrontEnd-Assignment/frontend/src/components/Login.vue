<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="loginUser" class="login-form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit" class="login-btn">Login</button>
    </form>

    <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

    <button class="register-btn" @click="goToRegister">Register</button>
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
        const response = await axios.post('http://localhost:5000/login', {
          email: this.email,
          password: this.password
        });

        if (response.status === 200) {
          localStorage.setItem('user_id', response.data.user_id);
          this.$router.push('/dashboard');
          this.$emit('login-success');
        }
      } catch (error) {
        this.errorMessage = error.response?.data?.error || 'Login failed.';
      }
    },
    goToRegister() {
      this.$router.push('/register');
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  background: #fff;
  text-align: center;
}

h1 {
  margin-bottom: 20px;
  color: #333;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #aaa;
}

.login-btn, .register-btn {
  padding: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.register-btn {
  background-color: #28a745;
  margin-top: 15px;
}

.login-btn:hover,
.register-btn:hover {
  opacity: 0.9;
}

.error-msg {
  color: red;
  margin-top: 10px;
}
</style>
