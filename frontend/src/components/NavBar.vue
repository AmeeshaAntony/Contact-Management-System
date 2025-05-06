<template>
  <nav>
    <ul>
      <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
      <li v-if="!isLoggedIn"><router-link to="/register">Register</router-link></li>
      <li v-if="isLoggedIn"><router-link to="/dashboard">Dashboard</router-link></li>
      <li v-if="isLoggedIn"><router-link to="/add-contact">Add Contact</router-link></li>
      <li v-if="isLoggedIn"><router-link to="/viewcontacts">View Contacts</router-link></li>
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
nav ul {
  list-style: none;
  padding: 0;
}
nav li {
  display: inline-block;
  margin-right: 15px;
}
</style>
