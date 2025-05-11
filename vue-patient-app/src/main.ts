console.log('%c[Vue Patient App] main.ts execution started', 'color: blue; font-weight: bold;');

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css' // Tailwind CSS base styles

try {
  console.log('%c[Vue Patient App] Attempting to create Vue app instance...', 'color: blue;');
  const app = createApp(App)
  console.log('%c[Vue Patient App] Vue app instance created successfully.', 'color: green;');

  console.log('%c[Vue Patient App] Attempting to install Pinia...', 'color: blue;');
  app.use(createPinia())
  console.log('%c[Vue Patient App] Pinia installed successfully.', 'color: green;');

  console.log('%c[Vue Patient App] Attempting to install Vue Router...', 'color: blue;');
  app.use(router)
  console.log('%c[Vue Patient App] Vue Router installed successfully.', 'color: green;');
  
  router.isReady().then(() => {
    console.log('%c[Vue Patient App] Router is ready. Attempting to mount app to #app...', 'color: blue;');
    app.mount('#app')
    console.log('%c[Vue Patient App] Vue app mounted successfully to #app.', 'color: green; font-weight: bold;');
  }).catch(routerError => {
    console.error('%c[Vue Patient App] Vue Router failed to become ready:', 'color: red; font-weight: bold;', routerError);
    const appDiv = document.getElementById('app');
    if (appDiv) {
      appDiv.innerHTML = '<div style="padding: 20px; text-align: center; color: red; font-family: sans-serif;">路由加载失败，请检查浏览器控制台获取更多信息。</div>';
    }
  });

} catch (error) {
  console.error('%c[Vue Patient App] Critical error during app initialization:', 'color: red; font-weight: bold;', error);
  // Display a fallback message in the DOM if critical error occurs
  const appDiv = document.getElementById('app');
  if (appDiv) {
    // Clear previous content in case of re-attempt or partial render
    appDiv.innerHTML = '<div style="padding: 20px; text-align: center; color: red; font-family: sans-serif;">应用初始化失败，请检查浏览器控制台获取更多信息。</div>';
  }
}
