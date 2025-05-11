import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'virtual:svg-icons-register'
import globalComponents from './components'
import './styles/index.scss'
import './router/permission'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { hasButton } from './directive/button'
import pinia from '@/stores/setupPinia';

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(globalComponents)
hasButton(app)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

app.mount('#app')
