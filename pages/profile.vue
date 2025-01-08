<template>
  <div class="profile-page">
    <h1>Welcome to Your Profile</h1>
    <p>You are logged in as <strong>{{ userEmail }}</strong>.</p>
    <button @click="logout">Log Out</button>

    <hr />

    <!-- Display saved movies -->
    <MyMovies />

    <NuxtLink to="/">Go back home</NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import MyMovies from "@/components/mymovies.vue";

// Simulate logged-in user
const isLoggedIn = ref(true); // Assume user is logged in
const userEmail = ref("test@example.com"); // User email for display
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
  margin-top: 30px;
  padding: 20px;
  text-align: center;
}

h1 {
  font-size: 32px;
  margin-bottom: 10px;
}

p {
  font-size: 18px;
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #c0392b;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ddd;
  margin: 20px 0;
}
</style>
