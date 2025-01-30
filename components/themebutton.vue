<template>  
  <button ref="themeButton" @click="toggleColorMode" :class="themeSwitch">
    💡
  </button>
</template>

<script lang="ts" setup>

const colorMode = useColorMode();
const themeButton = ref<HTMLButtonElement | null>(null);

const toggleColorMode = () => {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark';
};

const themeSwitch = computed(() => {
  return colorMode.preference === 'dark' ? 'dark-mode' : 'light-mode';
});

// Ensure the button reflects the correct initial state
onMounted(() => {
  if (themeButton.value) {
    if (colorMode.preference === 'dark') {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      themeButton.value.classList.add('dark-mode');
      themeButton.value.classList.remove('light-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      themeButton.value.classList.add('light-mode');
      themeButton.value.classList.remove('dark-mode');
    }
  }
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