<template>
  <Header />
  <themebutton />
  <Search />
</template>

<script lang="ts" setup>
import Header from '~/components/header.vue';
import Search from '~/components/search.vue';
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Bangers&display=swap');

body {
  font-family: 'Bangers', sans-serif;
  font-size: 32px;
  margin: 0;
}
</style>
