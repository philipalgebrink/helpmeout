<template>
  <div>
    <button class="notifications" @click="toggleNotifications">Notifications</button>
    <div v-if="showNotifications" class="notificationsDropdown">
      <ul>
        <li v-for="request in filteredFriendRequests" :key="request.senderId">
          <p>@{{ request.senderNickname }} sent you a friend request</p>
          <button @click="acceptFriendRequest(request.senderId, request.senderNickname)">Accept</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCookie } from '#app';

const showNotifications = ref(false);
const friendRequests = ref([]);
const authCookie = useCookie('auth');

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const fetchFriendRequests = async () => {
  const token = authCookie.value;
  if (!token) {
    console.error('You need to be logged in to fetch friend requests.');
    return;
  }

  try {
    const response = await fetch(`/api/friends/get-friend-requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (response.ok) {
      friendRequests.value = result.friendRequests;
    } else {
      console.error('Failed to fetch friend requests:', result.error);
    }
  } catch (error) {
    console.error('Error fetching friend requests:', error);
  }
};

const { user } = useUser();

const acceptFriendRequest = async (senderId, senderNickname) => {
  const token = authCookie.value;
  if (!token) {
    console.error('You need to be logged in to accept friend requests.');
    return;
  }

  try {
    const response = await fetch('/api/friends/accept-friend-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        senderId, 
        senderNickname,
        userId: user.value?.userId, // Pass userId
        userNickname: user.value?.nickname 
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert('Friend request accepted successfully!');
      await fetchFriendRequests(); // Refetch friend requests to update the state
    } else {
      console.error('Failed to accept friend request:', result.error);
    }
  } catch (error) {
    console.error('Error accepting friend request:', error);
  }
};

const filteredFriendRequests = computed(() => {
  return friendRequests.value.filter(request => request.receiverNickname === user.value?.nickname);
});

onMounted(() => {
  console.log('User:', user.value);
  fetchFriendRequests();
});
</script>

<style scoped>
.notifications {
  background-color: #dd6520;
  border: none;
  color: white;
  padding: 6px 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 12px;
}

.notificationsDropdown {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.notificationsDropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notificationsDropdown li {
  margin-bottom: 10px;
}

.notificationsDropdown button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}

.notificationsDropdown button:hover {
  background-color: #2980b9;
}
</style>