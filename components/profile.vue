<template>
  <h1 v-if="showButton">Welcome to Your Profile, {{ nickname }}</h1>
  <h1 v-else>{{ nickname }}</h1>
  <navprofile />
  <mybio />
  <logoutbutton v-if="showButton" @click="logout"/>
</template>

<script lang="ts" setup>
const { showButton, nickname } = useShowButton();
const { logout } = useLogout();
const router = useRouter();
const authCookie = useCookie('auth');
</script>

<style scoped>

</style>