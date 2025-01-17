<template>
  <div class="profile-page">
    <header />
    <profile />
    <mymovies />
    <NuxtLink class="goBack" to="/">Go back home</NuxtLink>
  </div>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}

.goBack {
  color: #3498db;
  text-decoration: none;
}

.goBack:hover {
  text-decoration: underline;
}
</style>
