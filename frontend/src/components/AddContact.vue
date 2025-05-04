<template>
  <div class="add-contact">
    <h2>Add New Contact</h2>
    <form @submit.prevent="submitContact">
      <div>
        <label for="name">Name:</label>
        <input type="text" v-model="contact.name" id="name" required />
      </div>

      <div>
        <label for="phone">Phone:</label>
        <input type="text" v-model="contact.phone" id="phone" required />
      </div>

      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="contact.email" id="email" />
      </div>

      <button type="submit">Add Contact</button>
    </form>

    <!-- Success Message -->
    <div v-if="message" class="message success">{{ message }}</div>
    
    <!-- Error Message -->
    <div v-if="error" class="message error">{{ error }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      contact: {
        name: '',
        phone: '',
        email: '',
      },
      message: '',
      error: '',
    };
  },
  methods: {
    async submitContact() {
      try {
        // Retrieve user_id from localStorage or state (for example, if using JWT token or stored session)
        const userId = localStorage.getItem('user_id'); // or get it from your store if using Vuex
        
        if (!userId) {
          this.error = "User is not logged in";
          return;
        }

        // Add user_id to the contact object before sending the request
        this.contact.user_id = userId;

        const response = await fetch('http://localhost:5000/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.contact),
        });

        if (response.ok) {
          const data = await response.json();
          this.message = data.message; // Success message
          this.error = ''; // Clear any previous error message
          this.resetForm();
        } else {
          const errorData = await response.json();
          this.error = errorData.error; // Error message
          this.message = ''; // Clear any previous success message
        }
      } catch (error) {
        this.error = 'An error occurred while creating the contact.';
        this.message = ''; // Clear any previous success message
      }
    },
    resetForm() {
      this.contact = {
        name: '',
        phone: '',
        email: '',
      };
    }
  }
};
</script>

<style scoped>
.add-contact {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

h2 {
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
}

form div {
  margin-bottom: 10px;
}

form label {
  font-weight: bold;
}

form input {
  padding: 8px;
  margin-top: 4px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
}

button:hover {
  background-color: #45a049;
}

.message {
  margin-top: 10px;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}

.success {
  background-color: #d4edda;
  color: #155724;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
}
</style>
