<template>
  <div>
    <button class="notifications" @click="toggleNotifications">Notifications</button>
    <div v-if="showNotifications" class="notificationsDropdown">
      <h3>Received Friend Requests</h3>
      <ul>
        <li v-for="request in filteredFriendRequests" :key="request.senderId">
          <p>@{{ request.senderNickname }} sent you a friend request</p>
          <button @click="acceptFriendRequest(request.senderId, request.senderNickname)" :disabled="acceptingRequest">
            {{ acceptingRequest ? 'Accepting...' : 'Accept' }}
          </button>
          <button @click="declineFriendRequest(request.senderId)" :disabled="decliningRequest">
            {{ decliningRequest ? 'Declining...' : 'Decline' }}
          </button>
        </li>
      </ul>
      <p v-if="!filteredFriendRequests.length">No received friend requests.</p>

      <h3>Sent Friend Requests</h3>
      <ul>
        <li v-for="request in sentFriendRequests" :key="request.receiverId">
          <p>You sent a friend request to @{{ request.receiverNickname }}</p>
          <button @click="cancelFriendRequest(request.receiverNickname)" :disabled="cancelingRequest">
            {{ cancelingRequest ? 'Canceling...' : 'Cancel' }}
          </button>
        </li>
      </ul>
      <p v-if="!sentFriendRequests.length">No sent friend requests.</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCookie } from '#app';

const showNotifications = ref(false);
const friendRequests = ref([]);
const sentRequests = ref([]);
const authCookie = useCookie('auth');
const router = useRouter();
const acceptingRequest = ref(false);
const decliningRequest = ref(false);
const cancelingRequest = ref(false);

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const fetchFriendRequests = async () => {
  const token = authCookie.value;
  if (!token) {
    console.error('You need to be logged in to fetch friend requests.');
    router.push('/login');
    return;
  }

  try {
    const response = await fetch(`/api/friends/get-friend-requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (result.success) {
      friendRequests.value = result.receivedRequests || [];
      sentRequests.value = result.sentRequests || [];
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
    alert('You need to be logged in to accept friend requests.');
    router.push('/login');
    return;
  }

  acceptingRequest.value = true;
  try {
    const response = await fetch('/api/friends/accept-friend-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        senderId,
        senderNickname
      }),
    });

    const result = await response.json();

    if (result.success) {
      alert('Friend request accepted successfully!');
      showNotifications.value = false;
      await fetchFriendRequests();
    } else {
      alert(result.error || 'Failed to accept friend request');
      console.error('Failed to accept friend request:', result.error);
    }
  } catch (error) {
    console.error('Error accepting friend request:', error);
    alert('Failed to accept friend request. Please try again.');
  } finally {
    acceptingRequest.value = false;
  }
};

const declineFriendRequest = async (senderId) => {
  const token = authCookie.value;
  if (!token) {
    alert('You need to be logged in to decline friend requests.');
    router.push('/login');
    return;
  }

  decliningRequest.value = true;
  try {
    const response = await fetch('/api/friends/decline-friend-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ senderId }),
    });

    const result = await response.json();

    if (result.success) {
      alert('Friend request declined successfully!');
      showNotifications.value = false;
      await fetchFriendRequests();
    } else {
      alert(result.error || 'Failed to decline friend request');
      console.error('Failed to decline friend request:', result.error);
    }
  } catch (error) {
    console.error('Error declining friend request:', error);
    alert('Failed to decline friend request. Please try again.');
  } finally {
    decliningRequest.value = false;
  }
};

const cancelFriendRequest = async (receiverNickname) => {
  const token = authCookie.value;
  if (!token) {
    alert('You need to be logged in to cancel friend requests.');
    router.push('/login');
    return;
  }

  cancelingRequest.value = true;
  try {
    const response = await fetch('/api/friends/cancel-friend-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ receiverNickname }),
    });

    const result = await response.json();

    if (result.success) {
      alert('Friend request canceled successfully!');
      showNotifications.value = false;
      await fetchFriendRequests();
    } else {
      alert(result.error || 'Failed to cancel friend request');
      console.error('Failed to cancel friend request:', result.error);
    }
  } catch (error) {
    console.error('Error canceling friend request:', error);
    alert('Failed to cancel friend request. Please try again.');
  } finally {
    cancelingRequest.value = false;
  }
};

const filteredFriendRequests = computed(() => {
  return friendRequests.value.filter(request => request.receiverNickname === user.value?.nickname) || [];
});

const sentFriendRequests = computed(() => {
  return sentRequests.value || [];
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