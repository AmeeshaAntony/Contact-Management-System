import { createRouter, createWebHistory } from 'vue-router'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import AddContact from './components/AddContact.vue'
import Dashboard from './components/Dashboard.vue';
import ViewContacts from './components/ViewContacts.vue';
import EditContact from './components/EditContact.vue';

const routes = [
  { path: '/', redirect: '/login'},
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/add-contact', component: AddContact },
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '/viewcontacts', name: 'viewcontacts', component: ViewContacts },
  { path: '/edit-contact', name: 'editcontact', component: EditContact },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
