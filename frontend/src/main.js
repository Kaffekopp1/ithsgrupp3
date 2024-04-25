import { createApp } from 'vue'
import './style.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import App from './App.vue'
import router from './router'

const app = createApp(App);
// Use Vue Router
app.use(router);

// Mount the app to the specified element
app.mount('#app');
