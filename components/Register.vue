<template>
  <div class="register-page">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <div>
        <label for="nickname">Nickname:</label>
        <input type="nickname" id="nickname" v-model="nickname" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Register</button>
    </form>
  </div>
  <NuxtLink to="/login">
    <p>Already have an account? Login here!</p>
  </NuxtLink>
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
      alert('Register successful!');
      router.push('/login');
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
.register-page {
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