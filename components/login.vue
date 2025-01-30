<template>
  <div class="login-page">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Log In</button>
    </form>
  </div>
  <NuxtLink to="/register">
    <p>Don't have an account? Create one here!</p>
  </NuxtLink>
</template>

<script lang="ts" setup>

const email = ref('');
const password = ref('');
const router = useRouter();
const authCookie = useCookie('auth', { maxAge: 3600 * 1000 });

const handleLogin = async () => {
  try {
    const response = await $fetch('/api/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    });

    if (response.statusCode === 200) {
      if ('token' in response) {
        authCookie.value = response.token;
      }
      if ('user' in response) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      alert('Login successful!');
      router.push(`/u/${response.user.nickname}`); // Redirect to user profile
    } else {
      alert(response.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred. Please try again.');
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 300px;
}

input {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 10px;
  font-size: 16px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #3498db;
}
</style>