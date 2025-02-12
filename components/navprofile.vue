<template>
  <nav class="nav-profile">
    <ul>
      <li>
        <NuxtLink :to="`/u/${nickname}/lists`">
          <p>{{ lists.length }}</p>
          lists
        </NuxtLink>
      </li>
      <li>
        <NuxtLink :to="`/u/${nickname}/reviews`">
          <p>43</p>
          reviews
        </NuxtLink>
      </li>
      <li>
        <NuxtLink :to="`/u/${nickname}/friends`">
          <p>17</p>
          friends
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>

const route = useRoute();
const nickname = ref(route.params.nickname as string);
const lists = ref([]);

onMounted(async () => {
  try {
    const response = await fetch(`/api/get-lists?nickname=${nickname.value}`);
    if (response.ok) {
      const data = await response.json();
      lists.value = data.lists;
    } else {
      console.error('Failed to fetch lists');
    }
  } catch (error) {
    console.error('Error fetching lists:', error);
  }
});
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
  text-align: center;
}

.nav-profile a {
  text-decoration: none;
  font-size: 16px;
}

.nav-profile p {
  font-size: 20px;
  color: white;
}

.light-mode {
  .nav-profile p {
    color: black;
  }
}
</style>