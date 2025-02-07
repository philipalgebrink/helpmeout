<template>
  <nav class="nav-profile">
    <ul>
      <li>
        <NuxtLink :to="`/u/${nickname}/lists`" active-class="active">
        <p>23</p>
        lists</NuxtLink>
      </li>
      <li>
        <NuxtLink :to="`/u/${nickname}/reviews`" active-class="active">
        <p>43</p>
        reviews</NuxtLink>
      </li>
      <li>
        <NuxtLink :to="`/u/${nickname}/friends`" active-class="active">
        <p>17</p>
        friends</NuxtLink>
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
  height: 55px;
}

.nav-profile ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 20px;
}

.nav-profile li {
  margin: 0;
  line-height: 10px;
}

.nav-profile a {
  text-decoration: none;
  color: grey;
  font-size: 18px;
}

.nav-profile p {
  font-size: 24px;
  color: white;
}

.nav-profile a.active {
  color: #007bff;
}
</style>