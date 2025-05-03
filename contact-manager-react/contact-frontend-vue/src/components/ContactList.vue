<template>
  <div>
    <h2>Contact List</h2>
    <div v-if="loading">Loading contacts...</div>
    <div v-else-if="error">{{ error }}</div>
    <table v-if="contacts.length">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="contact in contacts" :key="contact.id">
          <td>{{ contact.name }}</td>
          <td>{{ contact.email }}</td>
          <td>{{ contact.phone }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>No contacts found.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ContactList',
  data() {
    return {
      contacts: [],
      loading: true,
      error: null,
    };
  },
  mounted() {
    axios.get('http://localhost:5000/contacts')
      .then(response => {
        this.contacts = response.data.contacts; // adapt this based on your backend
      })
      .catch(error => {
        this.error = "Failed to load contacts.";
        console.error(error);
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>
