import '@/assets/styles/main.scss';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import veeValidate from '@/plugins/vee-validate';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(veeValidate);

app.mount('#app');
