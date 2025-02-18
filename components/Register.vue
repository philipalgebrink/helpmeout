<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Register</h2>
      <div class="spacer" style="margin: 10px 0 20px 0"></div>
      <form @submit.prevent="handleRegister">
        <div class="input-group">
          <label for="nickname">Nickname</label>
          <input type="text" id="nickname" v-model="nickname" required />
        </div>
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">Register</button>
      </form>
      <NuxtLink to="/login" class="login-link">
        Already have an account? <span>Login here!</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
const nickname = ref('');
const email = ref('');
const password = ref('');
const router = useRouter();

const handleRegister = async () => {
  try {
    const response = await $fetch('/api/register', {
      method: 'POST',
      body: { nickname: nickname.value, email: email.value, password: password.value },
    });

    if (response.statusCode === 200) {
      alert('Registration successful!');
      router.push('/login');
    } else {
      alert(response.message);
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('An error occurred. Please try again.');
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 25px auto 0 auto;
  width: 800px;
  height: calc(100vh - 200px);
}

.register-card {
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

.login-link {
  display: block;
  margin-top: 15px;
  font-size: 14px;
  color: #555;
  text-decoration: none;
}

.login-link span {
  color: #3498db;
  font-weight: bold;
}

.login-link:hover span {
  text-decoration: underline;
}
</style>
