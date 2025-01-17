<template>
  <div class="profile-page">
    <h1>Welcome to Your Profile</h1>
    <p>You are logged in as <strong>{{ user?.email }}</strong>.</p>
    <button @click="logout">Log Out</button>

    <hr />

    <!-- Display saved movies -->
    <MyMovies />

    <NuxtLink class="goBack" to="/">Go back home</NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import MyMovies from '@/components/mymovies.vue';
import { useCookies } from '@vueuse/integrations/useCookies';

interface User {
  email: string;
}

const user = ref<User | null>(null);
const router = useRouter();
const cookies = useCookies(['auth']);

const logout = () => {
  cookies.remove('auth');
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

.goBack {
  margin-top: 20px;
  color: #3498db;
  text-decoration: none;
}

.goBack:hover {
  text-decoration: underline;
}
</style>