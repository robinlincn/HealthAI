import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false); // Default to false, true for testing dashboard directly
  const user = ref<any>(null); // Replace 'any' with your User type

  // Simulate login
  function login(userData: any) {
    // In a real app, you'd call an API and handle response
    isAuthenticated.value = true;
    user.value = userData;
    // Optionally, save auth state to localStorage
    localStorage.setItem('isAuthenticated', 'true');
  }

  // Simulate logout
  function logout() {
    isAuthenticated.value = false;
    user.value = null;
    localStorage.removeItem('isAuthenticated');
  }
  
  // Check localStorage on store initialization
  function checkAuthStatus() {
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      isAuthenticated.value = true;
      // Optionally, fetch user details if token/session is stored
    }
  }

  checkAuthStatus(); // Check auth status when store is initialized

  return { isAuthenticated, user, login, logout, checkAuthStatus };
});
