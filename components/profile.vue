<template>
  <div class="profile-page">
    <h1>{{ nickname }}</h1>
    <button @click="logout">Log Out</button>
    <mymovies :nickname="nickname" />
  </div>
</template>

<script lang="ts" setup>

interface User {
  email: string;
  nickname: string;
}

const user = ref<User | null>(null);
const router = useRouter();
const route = useRoute();
const authCookie = useCookie('auth');
const nickname = ref(route.params.nickname as string);

const logout = () => {
  authCookie.value = null;
  localStorage.removeItem('user');
  alert('You have been logged out.');
  router.push('/login');
};

const updateUser = () => {
  nickname.value = route.params.nickname as string;
};

onMounted(updateUser);
watch(() => route.params.nickname, updateUser);
</script>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}
</style>