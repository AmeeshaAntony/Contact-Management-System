<template>
  <div class="register">
    <h2>Register</h2>
    <form @submit.prevent="registerUser" enctype="multipart/form-data">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" v-model="name" required />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="phone">Phone Number:</label>
        <input type="tel" v-model="phone" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm Password:</label>
        <input type="password" v-model="confirmPassword" required />
      </div>
      <div class="form-group">
        <label for="profilePic">Profile Picture:</label>
        <input type="file" @change="handleFileChange" accept="image/*" />
        <div v-if="previewUrl" class="preview-container">
          <img :src="previewUrl" alt="Profile Preview" class="preview-image" />
        </div>
      </div>
      <div class="form-group">
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
      phone: '',
      password: '',
      confirmPassword: '',
      profilePic: null,
      previewUrl: null
    };
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.profilePic = file;
        this.previewUrl = URL.createObjectURL(file);
      }
    },
    async registerUser() {
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('name', this.name);
        formData.append('email', this.email);
        formData.append('phone', this.phone);
        formData.append('password', this.password);
        if (this.profilePic) {
          formData.append('profile_pic', this.profilePic);
        }

        console.log('Sending registration data:', {
          name: this.name,
          email: this.email,
          phone: this.phone,
          hasProfilePic: !!this.profilePic
        });

        const response = await axios.post('http://localhost:5000/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Registration successful:', response.data);
        alert('Registration successful! Please login.');
        this.$router.push('/login');
      } catch (error) {
        console.error('Registration failed:', error);
        const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
        alert(errorMessage);
      }
    }
  }
};
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #ff5e62;
}

button {
  width: 100%;
  padding: 10px;
  background: #ff5e62;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #ff4448;
}

.preview-container {
  margin-top: 10px;
  text-align: center;
}

.preview-image {
  max-width: 150px;
  max-height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ff5e62;
}

p {
  text-align: center;
  margin-top: 15px;
}

a {
  color: #ff5e62;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
