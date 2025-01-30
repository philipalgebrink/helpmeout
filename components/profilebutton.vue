<template>
  <div>
    <button @click="goToProfile">🙍‍♂️</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const nickname = ref<string | null>(null);

const goToProfile = () => {
  if (nickname.value) {
    router.push(`/u/${nickname.value}`);
  } else {
    router.push('/login');
  }
};

const updateNickname = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    nickname.value = user.nickname;
  }
};

onMounted(updateNickname);
watch(() => localStorage.getItem('user'), updateNickname);
</script>

<style scoped>
button {
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