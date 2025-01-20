<template>
  <div class="profile-page">
    <h1>Welcome to Your Profile</h1>
    <p>You are logged in as <strong>{{ user?.email }}</strong>.</p>
    <button @click="logout">Log Out</button>
  </div>
</template>

<script lang="ts" setup>
interface User {
  email: string;
}

const user = ref<User | null>(null);
const router = useRouter();
const authCookie = useCookie('auth');

const logout = () => {
  authCookie.value = null;
  localStorage.removeItem('user');
  alert('You have been logged out.');
  router.push('/login');
};

onMounted(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  } else {
    router.push('/login');
  }
});
</script>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}
</style>