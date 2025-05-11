<template>
  <nav class="navbar">
    <ul class="navbar-list">
      <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
      <li v-if="!isLoggedIn"><router-link to="/register">Register</router-link></li>
      <li v-if="isLoggedIn"><router-link to="/add-contact">Add Contacts</router-link></li>
      <li v-if="isLoggedIn"><router-link to="/viewcontacts">View Contacts</router-link></li>
      <li v-if="isLoggedIn"><router-link to="/edit-profile">Edit Profile</router-link></li>
      <li v-if="isLoggedIn"><a href="#" @click="logout">Logout</a></li>
    </ul>
  </nav>
</template>

<script>
export default {
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem("user_id");
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
.navbar {
  width: 100%;
  min-width: 100%;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 0 40px;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  height: 64px;
}
.navbar-list {
  display: flex;
  align-items: center;
  gap: 0;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
}
.navbar-list li {
  flex: 1 1 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
}
.navbar-list a,
.navbar-list .router-link-active {
  color: #222;
  text-decoration: none;
  font-size: 1.08rem;
  font-weight: 500;
  padding: 8px 18px;
  border-radius: 6px;
  transition: background 0.18s, color 0.18s;
  width: 100%;
  display: block;
}
.navbar-list a:hover,
.navbar-list .router-link-active {
  background: #ff5e62;
  color: #fff;
}
@media (max-width: 700px) {
  .navbar {
    padding: 0 10px;
    height: 54px;
  }
  .navbar-list {
    gap: 0;
  }
  .navbar-list li {
    height: 54px;
  }
  .navbar-list a {
    font-size: 0.98rem;
    padding: 6px 10px;
  }
}
</style>
