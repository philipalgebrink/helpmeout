<template>
  <div v-if="isLoading">
    <loading />
  </div>
  <div v-else class="profile">
    <div class="profileHeader">
      <div class="backgroundImage" :style="{ backgroundImage: `url(${profileBannerUrl || placeholderBannerUrl})` }"></div>
      <div class="gradientOverlay"></div>
      <div class="profilePictureContainer">
        <profilepicture :src="profilePictureUrl || placeholderProfilePictureUrl" />
        <div v-if="!showButton" class="profileButtons">
          <button v-if="!isFriend" @click="sendFriendRequest">Add Friend</button>
          <button v-else @click="removeFriend">Remove Friend</button>
        </div>
        <div v-if="showButton" class="profileButtons">
          <notificationbutton />
          <editprofilebutton />
        </div>
      </div>
      <div class="profileInfo">
        <h1>@{{ nickname }}</h1>
        <navprofile />
      </div>
      <div v-if="showButton" class="settingsButton">
        <settingsbutton />
      </div>
    </div>
    <spacer style="--spacer-animation-duration: 1.5s;" />
    <div class="contentContainer">
      <div class="titleContainer">
        <NuxtLink @click.prevent="GoToLists">{{ showButton ? 'My Lists' : `${nickname}'s Lists` }} ➡️</NuxtLink>
        <createlistbutton v-if="showButton" />
      </div>
      <div class="mylistsContainer">
        <mylists :maxLists="4" />
      </div>
      <spacer style="--spacer-animation-duration: 2s;" />
      <NuxtLink @click="">{{ showButton ? 'My Reviews' : `${nickname}'s Reviews` }} ➡️</NuxtLink>
      <myreviews />
      <spacer style="--spacer-animation-duration: 2.5s;" />
      <NuxtLink @click="">{{ showButton ? 'My Friends' : `${nickname}'s Friends` }} ➡️</NuxtLink>
      <myfriends />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { showButton, nickname } = useShowButton();
const profilePictureUrl = ref('');
const profileBannerUrl = ref('');
const isLoading = ref(true);
const isFriend = ref(false);
const authCookie = useCookie('auth');
const refreshCookie = useCookie('refresh');
const route = useRoute();
const friendNickname = ref(route.params.nickname);

const placeholderProfilePictureUrl = 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=';
const placeholderBannerUrl = 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=';

const router = useRouter();

const GoToLists = () => {
  router.push(`/u/${nickname.value}/lists`);
};

const refreshAuthToken = async () => {
  try {
    const response = await fetch('/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshCookie.value}`,
      },
    });

    const result = await response.json();

    if (response.ok) {
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

const fetchFriends = async () => {
  const token = authCookie.value;
  if (!token) {
    console.error('You need to be logged in to fetch friends.');
    return;
  }

  try {
    const response = await fetch(`/api/friends/get-friends?nickname=${nickname.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (response.ok) {
      isFriend.value = result.isFriend;
    } else if (result.error === 'jwt expired') {
      const refreshed = await refreshAuthToken();
      if (refreshed) {
        await fetchFriends();
      } else {
        router.push('/login');
      }
    } else {
      console.error('Failed to fetch friends:', result.error);
    }
  } catch (error) {
    console.error('Error fetching friends:', error);
  }
};

const sendFriendRequest = async () => {
  const token = authCookie.value;
  if (!token) {
    alert('You need to be logged in to send a friend request.');
    router.push('/login');
    return;
  }

  const user = JSON.parse(localStorage.getItem('user'));
  const userNickname = user?.nickname;

  if (!userNickname) {
    alert('User nickname is missing');
    return;
  }

  try {
    const response = await fetch('/api/friends/send-friend-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ friendNickname: friendNickname.value, userNickname }),
    });

    const result = await response.json();

    if (response.ok) {
      alert('Friend request sent successfully!');
    } else if (result.error === 'jwt expired') {
      const refreshed = await refreshAuthToken();
      if (refreshed) {
        await sendFriendRequest();
      } else {
        router.push('/login');
      }
    } else {
      alert(result.error || 'Failed to send friend request');
      console.error('Failed to send friend request:', result.error);
    }
  } catch (error) {
    console.error('Error sending friend request:', error);
    alert('Failed to send friend request. Please try again.');
  }
};

const removeFriend = async () => {
  const token = authCookie.value;
  if (!token) {
    alert('You need to be logged in to remove friends.');
    router.push('/login');
    return;
  }

  try {
    const response = await fetch('/api/friends/remove-friend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ friendNickname: friendNickname.value }),
    });

    const result = await response.json();

    if (response.ok) {
      alert('Friend removed successfully!');
      isFriend.value = false;
      await fetchFriends(); // Refetch friends list to update the state
    } else if (result.error === 'jwt expired') {
      const refreshed = await refreshAuthToken();
      if (refreshed) {
        await removeFriend();
      } else {
        router.push('/login');
      }
    } else {
      alert(result.error || 'Failed to remove friend');
      console.error('Failed to remove friend:', result.error);
    }
  } catch (error) {
    console.error('Error removing friend:', error);
    alert('Failed to remove friend. Please try again.');
  }
};

onMounted(async () => {
  try {
    const [pictureResponse, bannerResponse] = await Promise.all([
      fetch(`/api/profile-picture?nickname=${nickname.value}`),
      fetch(`/api/profile-banner?nickname=${nickname.value}`)
    ]);

    if (pictureResponse.ok) {
      const pictureData = await pictureResponse.json();
      profilePictureUrl.value = pictureData.profilePictureUrl || placeholderProfilePictureUrl;
    } else {
      console.error('Failed to fetch profile picture');
    }

    if (bannerResponse.ok) {
      const bannerData = await bannerResponse.json();
      profileBannerUrl.value = bannerData.profileBannerUrl || placeholderBannerUrl;
    } else {
      console.error('Failed to fetch profile banner');
    }

    await fetchFriends();
  } catch (error) {
    console.error('Error fetching profile data:', error);
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 1000);
  }
});
</script>

<style scoped>
.profile {
  width: 800px;
}

.profileHeader {
  display: flex;
  gap: 20px;
  height: 210px;
  align-items: center;
  position: relative;
}

.backgroundImage {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -2;
}

.gradientOverlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(0deg, rgb(0, 0, 0) 10%, rgba(255, 117, 37, 0.12) 100%);
  z-index: -1;
}

.profile h1 {
  font-size: 36px;
  letter-spacing: 2px;
}

.profilePictureContainer {
  display: flex;
  flex-direction: column;
}

.profileButtons {
  display: flex;
  gap: 5px;
  margin-top: 10px;
}

.profileInfo {
  display: flex;
  flex-direction: column;
}

.settingsButton {
  position: absolute;
  top: 0;
  right: 0;
}

.navContainer {
  gap: 20px;
}

.contentContainer {
}

.titleContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mylistsContainer {
  height: 245px;
  max-height: 245px;
}
</style>