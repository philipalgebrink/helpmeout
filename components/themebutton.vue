<template>  
  <button @click="toggleColorMode" :class="themeSwitch">
    💡
  </button>
</template>

<script lang="ts" setup>

const colorMode = useColorMode();

const toggleColorMode = () => {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark';
};

const themeSwitch = computed(() => {
  return colorMode.preference === 'dark' ? 'dark-mode' : 'light-mode';
});

</script>

<style>

button.light-mode, button.dark-mode {
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
  filter: none;
  transition: filter 1s ease;
}

button.dark-mode {
  filter: grayscale(100%);
}

button.dark-mode:hover, button.light-mode:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

</style>