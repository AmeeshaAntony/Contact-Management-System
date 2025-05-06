<template>
  <div>
    <h2>Your Contacts</h2>
    <div v-if="contacts.length === 0">No contacts found.</div>
    <ul>
      <li v-for="contact in contacts" :key="contact.id">
        <strong>{{ contact.name }}</strong> – {{ contact.phone }} – {{ contact.email }}
        <button @click="editContact(contact)">Update</button>
        <button @click="deleteContact(contact.id)">Delete</button>
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
      this.contacts = allContacts.filter(contact => String(contact.user_id) === user_id);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  },
  methods: {
    async deleteContact(contactId) {
      try {
        await axios.delete(`http://localhost:5000/contacts/${contactId}`);
        this.contacts = this.contacts.filter(contact => contact.id !== contactId);
        alert("Contact deleted successfully");
      } catch (error) {
        console.error("Error deleting contact:", error);
        alert("Failed to delete contact");
      }
    },
    editContact(contact) {
      console.log("Saving contact to localStorage:", contact); 
      localStorage.setItem('edit_contact', JSON.stringify(contact));
      this.$router.push('/edit-contact');
    }
  }
};
</script>
