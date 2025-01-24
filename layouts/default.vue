<template>
  <div>
    <Header />
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

.light-mode body {
  transition: background-color 1s ease;
  background-color: white;
  color: rgba(0,0,0,0.8);
}
.dark-mode body {
  transition: background-color 1s ease;
  background-color: black;
  color: #ebf4f1;
}

</style>
