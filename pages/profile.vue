<template>
  <div class="profile-page">
    <h2>Welcome to Your Profile</h2>
    <p>You are logged in as <strong>test@example.com</strong>.</p>
    <button @click="logout">Log Out</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

// Shared authentication state
const isLoggedIn = ref(true); // Assume user is logged in
const router = useRouter();

const logout = () => {
  isLoggedIn.value = false; // Set authentication state to false
  alert("You have been logged out.");
  router.push("/login"); // Redirect to Login page
};
</script>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}

button {
  padding: 10px;
  font-size: 16px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

button:hover {
  background-color: #c0392b;
}
</style>
