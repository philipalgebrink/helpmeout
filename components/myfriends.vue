<template>
  <div class="myfriends">
    <div class="myfriendsContainer">
      <ul>
        <li v-for="friend in friends" :key="friend.friendNickname">
          <NuxtLink :to="`/u/${friend.friendNickname}`">
            <img
              :src="friend.profilePictureUrl || 'https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg'"
              alt="profile picture" />
            <p>@{{ friend.friendNickname }}</p>
          </NuxtLink>
        </li>
      </ul>
      <p v-if="!friends.length && !loading">No friends found.</p>
      <p v-if="loading">Loading friends...</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { useCookie } from '#app';

const friends = ref([]);
const loading = ref(false);
const authCookie = useCookie('auth');
const route = useRoute();
const nickname = ref(route.params.nickname);

const fetchFriends = async () => {
  const token = authCookie.value;
  if (!token) {
    console.error('You need to be logged in to fetch friends.');
    return;
  }

  loading.value = true;
  try {
    console.log('Fetching friends for nickname in myfriends:', nickname.value);
    const response = await fetch(`/api/friends/get-friends?nickname=${nickname.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    console.log('Get-friends API response in myfriends:', result);
    if (result.success) {
      friends.value = result.friends || [];
    } else {
      console.error('Failed to fetch friends:', result.error);
    }
  } catch (error) {
    console.error('Error fetching friends:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchFriends();
});
</script>

<style scoped>
.myfriends {
  display: flex;
  flex-direction: column;
  max-height: 500px;
  overflow: hidden;
}

.myfriendsContainer {
  margin-top: 10px;
}

.myfriendsContainer ul {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  justify-items: center;
}

.myfriendsContainer li {
  display: flex;
  flex-direction: row;
  list-style: none;
  align-items: center;
  gap: 10px;
}

.myfriendsContainer img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>