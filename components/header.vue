<template>
  <header>
    <div class="container">
      <!-- Left Placeholder (can be used for future navigation or logo) -->
      <div class="left-placeholder"></div>

      <!-- Centered Title -->
      <NuxtLink style="text-decoration: none; color: inherit;" to="/">
        <h1>Help Me Out</h1>
      </NuxtLink>

      <!-- Authentication Button -->
      <div class="auth-button">
        <Profilebutton />
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
  background: radial-gradient(circle, rgba(221,101,32,1) 0%, rgba(255,255,255,0) 100%);
  color: white;
  font-family: "Bangers", sans-serif;
  letter-spacing: 3px;
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
  font-size: 24px; /* Slightly reduced font size for responsiveness */
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
  border: none;
  border-radius: 5px;
  padding: 10px 10px;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  text-decoration: none;
  letter-spacing: 1px;
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
