<template>
  <div>
    <h1>Vue Contact Management</h1>

    <div v-if="!loggedIn">
      <Register />
      <Login @login-success="handleLoginSuccess" />
    </div>

    <div v-else>
      <ContactList />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Register from './components/Register.vue'
import Login from './components/Login.vue'
import ContactList from './components/ContactList.vue'

const loggedIn = ref(false)

function handleLoginSuccess() {
  loggedIn.value = true
}
</script>
