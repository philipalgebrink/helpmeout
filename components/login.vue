<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Login</h2>
      <spacer style="margin: 10px 0 20px 0; --spacer-animation-duration: 2s;" />
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label :class="{ active: email || emailFocused }" for="email">Email Address</label>
          <input type="email" id="email" v-model="email" @focus="emailFocused = true" @blur="emailFocused = false"
            required />
        </div>
        <div class="input-group">
          <label :class="{ active: password || passwordFocused }" for="password">Password</label>
          <input type="password" id="password" v-model="password" @focus="passwordFocused = true"
            @blur="passwordFocused = false" required />
        </div>
        <NuxtLink to="/reset-password" class="forgot-password">Forgot Password?</NuxtLink>
        <button type="submit">Log In</button>
      </form>
      <NuxtLink to="/register" class="register-link">
        Don't have an account? <span>Create one here!</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCookie } from 'nuxt/app';

const email = ref('');
const password = ref('');
const emailFocused = ref(false);
const passwordFocused = ref(false);
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
  margin: 0 auto;
  width: 800px;
  height: calc(100vh - 200px);
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
  position: relative;
  margin-bottom: 20px;
}

.input-group label {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #ececec;
  transition: all 0.3s ease;
  pointer-events: none;
}

/* Move label up when input is focused or has text */
.input-group input:focus+label,
.input-group label.active {
  top: -5px;
  font-size: 14px;
  color: #a0a0a0;
}

.input-group input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-bottom: 2px solid #555;
  background: transparent;
  color: white;
  outline: none;
  transition: border-color 0.3s ease;
}

.input-group input:focus {
  border-bottom: 2px solid rgba(221, 101, 32, 1);
}

.forgot-password {
  display: block;
  text-align: left;
  font-size: 14px;
  margin: -10px 0 15px;
  color: #a0a0a0;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #ececec;
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
  color: #aaa;
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
