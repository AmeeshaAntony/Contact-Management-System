<template>
  <div>
    <h1>Welcome to the Dashboard</h1>
    <p>Your user ID: {{ userId }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId: localStorage.getItem('user_id')  // Get user ID from localStorage
    };
  }
};
</script>
