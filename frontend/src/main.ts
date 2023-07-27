import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import router from './router'
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/config/firebase";

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')

const firebase = initializeApp(firebaseConfig);

export { firebase }
