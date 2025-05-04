import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import AddContact from '../components/AddContact.vue'

const routes = [
  { path: '/', component: Login },  // Login page (default route)
  { path: '/register', component: Register },  // Register page
  { path: '/add-contact', component: AddContact },  // Add Contact page
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
