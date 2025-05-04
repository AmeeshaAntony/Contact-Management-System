import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router,  // Make sure the router is passed here
}).$mount('#app');
