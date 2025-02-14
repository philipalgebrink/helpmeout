<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Login</h2>
      <div class="spacer"></div>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">Log In</button>
      </form>
      <NuxtLink to="/register" class="register-link">
        Don't have an account? <span>Create one here!</span>
      </NuxtLink>
    </div>
  </div>
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
      router.push(`/u/${response.user.nickname}`);
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
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 25px auto 0 auto;
  width: 800px;
}

.login-card {
  background: linear-gradient(0deg, rgb(0, 0, 0) 10%, rgba(255, 117, 37, 0.12) 100%);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 350px;
}

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  text-align: left;
}

.input-group label {
  font-size: 14px;
  margin-bottom: 5px;
  color: #555;
}

.input-group input {
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border 0.3s ease;
}

.input-group input:focus {
  border-color: #3498db;
  outline: none;
}

button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background-color: #3498db;
}

.register-link {
  display: block;
  margin-top: 15px;
  font-size: 14px;
  color: #555;
  text-decoration: none;
}

.register-link span {
  color: #3498db;
  font-weight: bold;
}

.register-link:hover span {
  text-decoration: underline;
}
</style>
