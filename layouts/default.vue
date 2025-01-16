<template>
  <div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { initializeMyMovies, fetchMoviesFromDB } from "@/store/mylist"; // Import the initialization function

onMounted(() => {
  // Run the movie initialization when the app starts
  console.log("Initializing movies...");
  initializeMyMovies()
    .then(() => console.log("Movies successfully initialized"))
    .catch((err) => console.error("Failed to initialize movies:", err));
  fetchMoviesFromDB();
});
</script>

<style>
/* Add your global layout styles here if needed */
</style>
