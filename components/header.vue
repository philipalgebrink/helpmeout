<template>
  <header>
    <div class="container">
      <!-- Left Placeholder (can be used for future navigation or logo) -->
      <div class="left-placeholder"></div>

      <!-- Centered Title -->
      <h1>Help Me Out</h1>

      <!-- Authentication Button -->
      <div class="auth-button">
        <NuxtLink v-if="isLoggedIn" to="/profile">Profile</NuxtLink>

        <NuxtLink v-else to="/login">Login</NuxtLink>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>

// Simulate authentication state
const isLoggedIn = ref(true);

</script>

<style scoped>
/* Header styling */
header {
  padding: 20px 10px;
  background-color: rgb(255, 94, 0);
  color: white;
  font-family: "Bangers", sans-serif;
  letter-spacing: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for elevation */
}

/* Flex container for layout */
.container {
  display: flex;
  justify-content: space-between; /* Space between items */
  align-items: center; /* Vertically align items */
}

/* Placeholder for left content */
.left-placeholder {
  flex: 1; /* Ensures title stays centered */
}

/* Centered title styling */
h1 {
  font-size: 48px; /* Slightly reduced font size for responsiveness */
  margin: 0;
  text-align: center;
  flex: 2; /* Center title with more flexibility */
}

/* Auth button container */
.auth-button {
  display: flex;
  justify-content: flex-end;
  flex: 1; /* Align to the right */
}

/* Auth button styling */
.auth-button a {
  background-color: white;
  color: rgb(255, 94, 0);
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  text-decoration: none;
}

.auth-button a:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  h1 {
    font-size: 32px;
  }

  .auth-button a {
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>
