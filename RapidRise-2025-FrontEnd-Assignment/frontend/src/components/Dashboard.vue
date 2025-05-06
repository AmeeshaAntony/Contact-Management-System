<template>
  <div>
    <h1>Welcome to the Dashboard</h1>
    <div v-if="userId">
      <p>Your user ID: {{ userId }}</p>

      
      <div>
        <router-link to="/add-contact">Add Contact</router-link>
        <br />
        <router-link to="/viewcontacts">View Contacts</router-link>
        <br />
        <a href="/" @click="logout">Logout</a>
      </div>
      <div id="dashboard-react-root"></div>
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
      userId: localStorage.getItem('user_id')  
    };
  }
};
</script>

<!-- React component should be rendered separately, e.g., in a dedicated .jsx file -->
