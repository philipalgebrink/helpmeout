<template>
  <div class="profile">
    <div class="profileHeader" :style="{ backgroundImage: `url(${profileBannerUrl})` }">
      <div class="profilePictureContainer">
        <profilepicture />
        <div v-if="showButton" class="profileButtons">
          <notificationbutton />
          <editbutton />
        </div>
      </div>
      <div class="profileInfo">
        <h1>@ {{ nickname }}</h1>
        <navprofile />
      </div>
      <div class="settingsButton">
        <settingsbutton />
      </div>
    </div>
    <spacer />
    <div class="contentContainer">
      <mylists />
      <spacer />
      <myreviews />
      <spacer />
      <myfriends />
      <spacer />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { showButton, nickname } = useShowButton();
const profilePictureUrl = ref('https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg');
const profileBannerUrl = ref('https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg');

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
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 210px;
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
  margin-left: auto;
  filter: invert();
}

.navContainer {
  gap: 20px;
}

.contentContainer {
}

</style>