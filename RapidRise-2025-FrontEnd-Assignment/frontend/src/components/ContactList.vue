<template>
  <div>
    <h2>Your Contacts</h2>
    <div v-if="contacts.length === 0">No contacts found.</div>
    <ul>
      <li v-for="contact in contacts" :key="contact.id">
        <strong>{{ contact.name }}</strong> – {{ contact.phone }} – {{ contact.email }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      contacts: [],  
    };
  },
  mounted() {
    this.fetchContacts();  
  },
  methods: {
    async fetchContacts() {
      const user_id = localStorage.getItem('user_id');
      if (!user_id) {
        alert("Please log in");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/contacts?user_id=${user_id}`);
        this.contacts = response.data;  
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    }
  }
};
</script>
