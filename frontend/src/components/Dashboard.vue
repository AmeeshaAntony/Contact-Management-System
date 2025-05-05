<template>
  <div>
    <h1>Welcome to the Dashboard</h1>
    <div v-if="userId">
      <p>Your user ID: {{ userId }}</p>
    </div>
    <div v-else>
      <p>Please log in to view your dashboard and contacts.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId: localStorage.getItem('user_id')  // Get user ID from localStorage
    };
  },
  methods: {
    viewContacts() {
      // If user is logged in, navigate to the contacts page
      if (this.userId) {
        this.$router.push('/contacts');  // Redirect to the "View Contacts" page
      } else {
        alert('Please log in to view contacts.');
      }
    }
  }
};
</script>
