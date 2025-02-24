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

const placeholderProfilePictureUrl = 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=';
const placeholderBannerUrl = 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=';

const router = useRouter();

const GoToLists = () => {
  router.push(`/u/${nickname.value}/lists`);
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