import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import mitt from 'mitt';

const app = createApp(App);

// Attach event bus
const emitter = mitt();
app.config.globalProperties.emitter = emitter;

app.use(router).mount('#app');

// Mount React app
import './reactApp.jsx';
