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
          <input type="text" v-model="name" required />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" required />
        </div>
        <button type="submit" class="save-btn">Save Changes</button>
      </form>
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
      hasSavedProfilePic: false
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
        const response = await axios.put(`http://localhost:5000/user/${userId}`, {
          name: this.name,
          email: this.email
        });
        
        if (response.status === 200) {
          alert('Profile updated successfully!');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
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
</style> 