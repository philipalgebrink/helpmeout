<template>
  <div class="profile">
    <div class="profileHeader">
      <div class="backgroundImage" :style="{ backgroundImage: `url(${profileBannerUrl})` }"></div>
      <div class="gradientOverlay"></div>
      <div class="profilePictureContainer">
        <profilepicture />
        <div v-if="showButton" class="profileButtons">
          <notificationbutton />
          <editprofilebutton />
        </div>
      </div>
      <div class="profileInfo">
        <h1>@ {{ nickname }}</h1>
        <navprofile />
      </div>
      <div v-if="showButton" class="settingsButton">
        <settingsbutton />
      </div>
    </div>
    <spacer />
    <div class="contentContainer">
      <div class="titleContainer">
        <NuxtLink @click.prevent="GoToLists">{{ showButton ? 'My Lists' : `${nickname}'s Lists` }} ➡️</NuxtLink>
        <createlistbutton v-if="showButton" />
      </div>
      <mylists maxLists="4"/>
      <spacer />
      <NuxtLink @click="">{{ showButton ? 'My Reviews' : `${nickname}'s Reviews` }} ➡️</NuxtLink>
      <myreviews />
      <spacer />
      <NuxtLink @click="">{{ showButton ? 'My Friends' : `${nickname}'s Friends` }} ➡️</NuxtLink>
      <myfriends />
      <spacer />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { showButton, nickname } = useShowButton();
const profilePictureUrl = ref('https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg');
const profileBannerUrl = ref('https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg');

import { useRouter } from 'vue-router';

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
      profilePictureUrl.value = pictureData.profilePictureUrl || profilePictureUrl.value;
    } else {
      console.error('Failed to fetch profile picture');
    }

    if (bannerResponse.ok) {
      const bannerData = await bannerResponse.json();
      profileBannerUrl.value = bannerData.profileBannerUrl || profileBannerUrl.value;
    } else {
      console.error('Failed to fetch profile banner');
    }
  } catch (error) {
    console.error('Error fetching profile data:', error);
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
  margin: 20px 0 0 0;
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
</style>