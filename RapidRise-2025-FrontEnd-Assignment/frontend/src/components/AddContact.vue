<template>
  <div>
    <h2>Add Contact</h2>
    <form @submit.prevent="addContact">
      <input v-model="name" placeholder="Name" required />
      <input v-model="phone" placeholder="Phone" required />
      <input v-model="email" placeholder="Email" />
      <button type="submit">Add</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      name: '',
      phone: '',
      email: '',
    };
  },
  methods: {
    async addContact() {
      const user_id = localStorage.getItem('user_id');
      if (!user_id) {
        alert('User not logged in');
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/contacts', {
          name: this.name,
          phone: this.phone,
          email: this.email,
          user_id: user_id
        });
        alert('Contact added successfully');
        this.name = '';
        this.phone = '';
        this.email = '';
      } catch (error) {
        console.error("Add contact error:", error);
        alert('Failed to add contact');
      }
    }
  }
};
</script>
