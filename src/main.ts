import { createApp } from 'vue';

import App from '@/App.vue';
import router from '@/router';
import i18n from '@/locale';
import pinia from '@/plugins/pinia';
import ant from '@/plugins/ant.design';
import vee from '@/plugins/validation';

import '@/plugins/dayjs';

import './styles/main.scss';

const app = createApp(App);

app.use(ant).use(vee).use(i18n).use(pinia).use(router);

router.isReady().then(() => {
  app.mount('#app');
});
