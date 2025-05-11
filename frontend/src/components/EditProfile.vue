<template>
  <div class="edit-profile-container">
    <NavBar />
    <div class="edit-profile-content">
      <h1>Edit Profile</h1>
      
      <div class="profile-pic-section">
        <div class="profile-pic-container">
          <img v-if="profilePic" :src="profilePic" alt="Profile Picture" class="profile-pic" />
          <div v-else class="profile-pic-placeholder">
            <i class="fas fa-user"></i>
          </div>
        </div>
        <div class="profile-pic-actions">
          <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" style="display: none" />
          <button @click="$refs.fileInput.click()" class="upload-btn">Choose Image</button>
          <button v-if="selectedFile && !hasSavedProfilePic" @click="uploadProfilePic" class="save-btn">Save Profile Picture</button>
        </div>
      </div>

      <form @submit.prevent="updateProfile" class="profile-form">
        <div class="form-group">
          <label>Name</label>
          <input type="text" v-model="name" required @input="hasChanges = true" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" required @input="hasChanges = true" />
        </div>
        <button type="submit" class="save-btn" :class="{ 'saved': !hasChanges }">Save Changes</button>
      </form>

      <div class="home-button-container">
        <button @click="goToDashboard" class="home-btn">
          <i class="fas fa-home"></i> Home
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import NavBar from './NavBar.vue';

export default {
  components: { NavBar },
  data() {
    return {
      name: '',
      email: '',
      selectedFile: null,
      profilePic: null,
      hasSavedProfilePic: false,
      hasChanges: false
    };
  },
  async mounted() {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      try {
        const response = await axios.get(`http://localhost:5000/user/${userId}`);
        this.name = response.data.name;
        this.email = response.data.email;
        this.profilePic = response.data.profile_pic ? `http://localhost:5000${response.data.profile_pic}` : null;
        this.hasSavedProfilePic = !!response.data.profile_pic;
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  },
  methods: {
    goToDashboard() {
      this.$router.push('/dashboard');
    },
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        this.profilePic = URL.createObjectURL(this.selectedFile);
        this.hasSavedProfilePic = false;
      }
    },
    async uploadProfilePic() {
      if (!this.selectedFile) return;

      const formData = new FormData();
      formData.append('profile_pic', this.selectedFile);

      try {
        const userId = localStorage.getItem('user_id');
        const response = await axios.post(`http://localhost:5000/user/${userId}/profile-pic`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.status === 200) {
          this.profilePic = `http://localhost:5000${response.data.profile_pic}`;
          this.selectedFile = null;
          this.hasSavedProfilePic = true;
        }
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    },
    async updateProfile() {
      try {
        const userId = localStorage.getItem('user_id');
        this.hasChanges = false;
        const response = await axios.put(`http://localhost:5000/user/${userId}`, {
          name: this.name,
          email: this.email
        });
        
        if (response.status === 200) {
          localStorage.setItem('user_name', response.data.user.name);
          localStorage.setItem('user_email', response.data.user.email);
          
          alert('Profile updated successfully!');
          this.hasChanges = false;
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        this.hasChanges = true;
        alert(error.response?.data?.error || 'Failed to update profile. Please try again.');
      }
    }
  }
};
</script>

<style scoped>
.edit-profile-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.edit-profile-content {
  max-width: 600px;
  margin: 40px auto;
  padding: 32px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 32px;
}

.profile-pic-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.profile-pic-container {
  width: 150px;
  height: 150px;
  margin-bottom: 16px;
  position: relative;
}

.profile-pic {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ff5e62;
}

.profile-pic-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px dashed #ccc;
}

.profile-pic-placeholder i {
  font-size: 48px;
  color: #999;
}

.profile-pic-actions {
  display: flex;
  gap: 12px;
}

.upload-btn, .save-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.upload-btn {
  background: #f0f0f0;
  color: #333;
}

.upload-btn:hover {
  background: #e0e0e0;
}

.save-btn {
  background: #ff5e62;
  color: white;
}

.save-btn:hover {
  background: #ff4448;
}

.save-btn.saved {
  background: #ccc;
  cursor: default;
}

.save-btn.saved:hover {
  background: #ccc;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #333;
}

.form-group input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-group input:focus {
  outline: none;
  border-color: #ff5e62;
}

.home-button-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.home-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.home-btn i {
  font-size: 1.2rem;
}

.home-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.home-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style> 