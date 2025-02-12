<template>
  <div>
    <button ref="profileButton" @click="goToProfile" :class="buttonClass">🙍‍♂️</button>
  </div>
</template>

<script lang="ts" setup>

const router = useRouter();
const nickname = ref<string | null>(null);
const colorMode = useColorMode();
const profileButton = ref<HTMLButtonElement | null>(null);

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

const buttonClass = computed(() => {
  return colorMode.preference === 'dark' ? 'dark-mode' : 'light-mode';
});

// Ensure the button reflects the correct initial state
onMounted(() => {
  updateNickname();
});

watch(() => localStorage.getItem('user'), updateNickname);
</script>

<style scoped>
button.light-mode, button.dark-mode {
  background-color: transparent;
  border: none;
  border-radius: 5px;
  padding: 10px 10px;
  font-size: 24px;
  cursor: pointer;
  text-decoration: none;
  letter-spacing: 1px;
  filter: none;
  transition: filter 1s ease;
}

button.dark-mode {
  filter: grayscale(100%);
}

button:hover {
  scale: 1.1;
}
</style>