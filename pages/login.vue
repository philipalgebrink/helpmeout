<template>
  <div class="login-page">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Log In</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

// Authentication state (shared, can move to a store later)
const isLoggedIn = ref(false);
const router = useRouter();

const email = ref("");
const password = ref("");

const handleLogin = () => {
  // Simulated login logic
  if (email.value === "test@example.com" && password.value === "password123") {
    isLoggedIn.value = true; // Update authentication state
    alert("Login successful!");
    router.push("/profile"); // Redirect to Profile page
  } else {
    alert("Invalid credentials. Please try again.");
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 300px;
}

input {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 10px;
  font-size: 16px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #3498db;
}
</style>
