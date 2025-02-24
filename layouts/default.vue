<template>
  <div>
    <Header />
    <slot />
    <Footer />
  </div>
</template>

<script lang="ts" setup>
import { initializeMyMovies } from "@/store/mylist"; // Import the initialization function

onMounted(() => {
  initializeMyMovies()
    .then(() => console.log("Movies successfully initialized"))
    .catch((err) => console.error("Failed to initialize movies:", err));
});

</script>

<style>
body {
  transition: background-color 1s ease;
  background-color: black;
  color: #ebf4f1;
}

</style>
