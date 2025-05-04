<template>
  <div id="app">
    <nav>
      <ul>
        <li><router-link to="/login">Login</router-link></li>
        <li><router-link to="/register">Register</router-link></li>
        <li><router-link to="/add-contact">Add Contact</router-link></li>
      </ul>
    </nav>

    <router-view></router-view>  <!-- This will display the current route's component -->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
