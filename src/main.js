import '@/assets/styles/main.scss';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import veeValidate from '@/plugins/vee-validate';
import piniaPersistedstate from 'pinia-plugin-persistedstate';
import toastPlugin from '@/plugins/toast';

import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPersistedstate);
app.use(pinia);
app.use(router);
app.use(veeValidate);
await toastPlugin.setup(app);

app.mount('#app');
