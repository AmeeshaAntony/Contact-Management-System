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
      contacts: []
    };
  },
  async mounted() {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
      alert("Please log in");
      this.$router.push("/login");
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/contacts');
      const allContacts = response.data;
      // Filter contacts on frontend by user_id
      this.contacts = allContacts.filter(contact => String(contact.user_id) === user_id);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  }
};
</script>
