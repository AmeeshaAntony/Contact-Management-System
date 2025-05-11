<template>
  <div class="dashboard-container">
    <div class="dashboard-left">
      <div class="profile-pic-placeholder"></div>
      <div class="team-section">
        <div class="team-label">OUR TEAM</div>
        <div class="user-name">{{ userName }}</div>
        <div class="user-role">Member</div>
        <a href="#" class="explore-link">Explore</a>
      </div>
    </div>
    <div class="dashboard-right">
      <button class="logout-btn top-right" @click="logout">LOGOUT</button>
      <div class="welcome-box">
        <h1 class="welcome-title">Welcome, {{ userName }}!</h1>
        <div class="welcome-desc">
          Your personal dashboard for managing contacts and more.<br>
          <span class="desc-small">We offer solutions adapted to today's needs.</span>
        </div>
        <button class="view-more-btn" @click="showMore = !showMore">
          {{ showMore ? 'VIEW LESS' : 'VIEW MORE' }}
        </button>
        <transition name="fade">
          <div v-if="showMore" class="more-content">
            <h3>About This Dashboard</h3>
            <p>
              This dashboard is your central hub for managing your contacts and accessing all features of your account. Stay tuned for more updates and enhancements!
            </p>
            <h3>About Add Contacts</h3>
            <p>
              The Add Contacts page allows you to easily add new contacts to your list. Fill in the required details and save them for quick access and management.
            </p>
            <h3>About View Contacts</h3>
            <p>
              The View Contacts page displays all your saved contacts. You can view, edit, or delete contacts as needed, making it simple to keep your information up to date.
            </p>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userId: localStorage.getItem('user_id'),
      userName: '',
      showMore: false
    };
  },
  async mounted() {
    if (this.userId) {
      try {
        const response = await axios.get(`http://localhost:5000/user/${this.userId}`);
        this.userName = response.data.name;
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background: #fff;
}
.dashboard-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 40px 0;
  border-right: 1px solid #f0f0f0;
}
.profile-pic-placeholder {
  width: 320px;
  height: 320px;
  background: #fff0f0;
  border-radius: 50%;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #e57373;
  border: 4px dashed #ffb3b3;
}
.team-section {
  text-align: left;
  width: 320px;
}
.team-label {
  font-size: 0.95rem;
  letter-spacing: 2px;
  color: #888;
  margin-bottom: 8px;
  border-bottom: 2px solid #eee;
  display: inline-block;
  padding-bottom: 2px;
}
.user-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 8px 0 2px 0;
  color: #222;
}
.user-role {
  font-size: 1.1rem;
  color: #444;
  margin-bottom: 12px;
}
.explore-link {
  color: #ff5e62;
  text-decoration: underline;
  font-size: 1rem;
  cursor: pointer;
}
.dashboard-right {
  flex: 1;
  background: #ff5e62;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
}
.logout-btn {
  position: absolute;
  top: 32px;
  right: 48px;
  background: transparent;
  border: 2px solid #fff;
  color: #fff;
  padding: 10px 32px;
  border-radius: 18px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
  z-index: 2;
}
.logout-btn:hover {
  background: #fff;
  color: #ff5e62;
  border-color: #ff2222;
}
.logout-btn:active {
  background: #ff2222;
  color: #fff;
  border-color: #ff2222;
}
.logout-btn.top-right {
  position: absolute;
  top: 32px;
  right: 48px;
}
.welcome-box {
  max-width: 420px;
  padding: 48px 36px;
  background: rgba(255,255,255,0.07);
  border-radius: 0 0 0 60px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.04);
  text-align: left;
  position: relative;
}
.welcome-title {
  font-size: 2.1rem;
  font-weight: 700;
  margin-bottom: 18px;
  color: #fff;
}
.welcome-desc {
  font-size: 1.2rem;
  margin-bottom: 32px;
}
.desc-small {
  font-size: 1rem;
  color: #ffe0e0;
}
.view-more-btn {
  background: #fff;
  color: #ff5e62;
  border: none;
  padding: 10px 32px;
  border-radius: 0 18px 18px 18px;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 18px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.view-more-btn:hover {
  background: #ffe0e0;
  color: #ff2222;
}
.more-content {
  margin-top: 32px;
  background: rgba(255,255,255,0.13);
  border-radius: 18px;
  padding: 24px 18px;
  color: #fff;
  font-size: 1.1rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
@media (max-width: 900px) {
  .dashboard-container {
    flex-direction: column;
  }
  .dashboard-left, .dashboard-right {
    flex: unset;
    width: 100%;
    min-height: 320px;
    border: none;
  }
  .profile-pic-placeholder, .team-section {
    width: 90vw;
    max-width: 340px;
  }
  .welcome-box {
    border-radius: 0 0 0 30px;
    padding: 32px 12px;
  }
  .logout-btn.top-right {
    top: 16px;
    right: 16px;
  }
}
</style>
