<template>
  <nav class="nav-profile">
    <ul>
      <li>
        <NuxtLink :to="`/u/${nickname}/bio`" active-class="active">Bio</NuxtLink>
      </li>
      <li>
        <NuxtLink :to="`/u/${nickname}/collections`" active-class="active">Collections</NuxtLink>
      </li>
      <li>
        <NuxtLink :to="`/u/${nickname}/followers`" active-class="active">Followers</NuxtLink>
      </li>
      <li>
        <NuxtLink :to="`/u/${nickname}/following`" active-class="active">Following</NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>

const route = useRoute();
const nickname = ref(route.params.nickname as string);
</script>

<style scoped>
.nav-profile {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.nav-profile ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 20px;
}

.nav-profile li {
  margin: 0;
}

.nav-profile a {
  text-decoration: none;
  color: inherit;
  font-size: 24px;
}

.nav-profile a.active {
  color: #007bff;
}
</style>