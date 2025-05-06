<template>
  <div>
    <h2>Edit Contact</h2>
    <form @submit.prevent="updateContact">
      <div style="margin-bottom: 10px;">
        <label>Name:</label><br />
        <input v-model="contact.name" placeholder="Enter name" required />
      </div>
      <div style="margin-bottom: 10px;">
        <label>Phone:</label><br />
        <input v-model="contact.phone" placeholder="Enter phone number" required />
      </div>
      <div style="margin-bottom: 10px;">
        <label>Email:</label><br />
        <input v-model="contact.email" placeholder="Enter email address" required />
      </div>
      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      contact: {
        id: '',
        name: '',
        phone: '',
        email: ''
      }
    };
  },
  mounted() {
  const stored = localStorage.getItem('edit_contact');
  if (!stored) {
    alert("No contact data found. Redirecting to dashboard...");
    this.$router.push('/dashboard');
    return;
  }

  try {
    const parsed = JSON.parse(stored);
    console.log("Contact data retrieved:", parsed); 
    this.contact = {
      id: parsed?.id || '',
      name: parsed?.name || '',
      phone: parsed?.phone || '',
      email: parsed?.email || ''
    };
  } catch (error) {
    console.error("Error parsing contact data:", error);
    alert("Invalid contact data. Redirecting...");
    this.$router.push('/dashboard');
  }
},
  methods: {
    async updateContact() {
      try {
        await axios.put(`http://localhost:5000/contacts/${this.contact.id}`, {
          name: this.contact.name,
          phone: this.contact.phone,
          email: this.contact.email
        });
        alert("Contact updated successfully!");
        localStorage.removeItem('edit_contact');
        this.$router.push('/dashboard');
      } catch (error) {
        console.error("Error updating contact:", error);
        alert("Failed to update contact. Please try again.");
      }
    }
  }
};
</script>
