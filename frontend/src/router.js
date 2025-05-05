import { createRouter, createWebHistory } from 'vue-router'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import AddContact from './components/AddContact.vue'
import Dashboard from './components/Dashboard.vue';
import ViewContacts from './components/ViewContacts.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/addcontact', component: AddContact },
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '/viewcontacts', name: 'viewcontacts', component: ViewContacts }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
