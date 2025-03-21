<template>
  <div class="list-page">
    <h1>Movies in {{ listname }}</h1>
    <mymovies v-if="listId" :listId="listId" />
    <p v-else>List not found.</p>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const router = useRouter();
const authCookie = useCookie('auth');
const refreshCookie = useCookie('refresh');
const nickname = computed(() => route.params.nickname as string);
const listname = computed(() => decodeURIComponent(route.params.listname as string).trim());
const listId = ref<string | null>(null);
const lists = ref<any[]>([]);

const refreshAuthToken = async () => {
  try {
    const response = await fetch('/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshCookie.value}`,
      },
    });

    const result = await response.json();

    if (result.statusCode === 200) {
      authCookie.value = result.token;
      return true;
    } else {
      console.error('Failed to refresh token:', result.error);
      return false;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
};

// Fetch the listId based on the listname
const fetchListId = async () => {
  const token = authCookie.value;
  if (!token) {
    console.error('You need to be logged in to fetch lists.');
    router.push('/login');
    return;
  }

  try {
    console.log('Fetching lists for nickname:', nickname.value);
    console.log('Listname from route:', listname.value);
    const response = await fetch(`/api/get-lists?nickname=${nickname.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log('Get-lists API response:', data);

    if (data.statusCode === 200) {
      lists.value = data.lists;
      console.log('Lists retrieved:', lists.value);
      if (listname.value) {
        const matchingList = lists.value.find(list => {
          const matches = list.listName.trim().toLowerCase() === listname.value.trim().toLowerCase();
          console.log(`Comparing listName: "${list.listName}" with route listname: "${listname.value}" -> Matches: ${matches}`);
          return matches;
        });
        if (matchingList) {
          listId.value = matchingList._id;
          console.log('Found list ID for', listname.value, ':', listId.value);
        } else {
          console.error('List not found:', listname.value);
        }
      }
    } else if (data.error === 'jwt expired') {
      const refreshed = await refreshAuthToken();
      if (refreshed) {
        await fetchListId(); // Retry after refreshing token
      } else {
        router.push('/login');
      }
    } else {
      console.error('Failed to fetch lists:', data.error || 'Unknown error');
    }
  } catch (error) {
    console.error('Error fetching lists:', error);
  }
};

onMounted(async () => {
  await fetchListId();
});
</script>

<style scoped>
.list-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 28px;
  margin-bottom: 20px;
  color: #fff;
}
</style>