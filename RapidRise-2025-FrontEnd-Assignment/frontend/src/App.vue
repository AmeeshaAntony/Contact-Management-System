<template>
  <div id="app">
      

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false
    };
  },
  created() {
    this.$.appContext.config.globalProperties.emitter.on('login-success', () => {
      this.isLoggedIn = true;
    });
  },
  mounted() {
    // Clear session and redirect on project load
    localStorage.clear();
    this.isLoggedIn = false;

    if (this.$route.path !== '/login') {
      this.$router.push('/login');
    }
  },
  methods: {
    logout() {
      localStorage.clear();
      this.isLoggedIn = false;
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 15px;
}
nav li {
  display: inline;
}
</style>
