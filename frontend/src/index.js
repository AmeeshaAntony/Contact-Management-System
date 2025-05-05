import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import AddContact from '../components/AddContact.vue'

const routes = [
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/add-contact', name: 'addcontact', component: AddContact }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
