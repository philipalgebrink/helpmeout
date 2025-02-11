<template>
  <div class="profile">
    <div class="profileHeader">
      <div class="profilePictureContainer">
        <img class="profilePicture" src="https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg" alt="profile picture" />
        <div class="profileButtons">
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

const { nickname } = useShowButton();
</script>

<style scoped>
.profile {
  width: 800px;
}

.profileHeader {
  display: flex;
  gap: 20px;
}

.profile h1 {
  font-size: 36px;
}

.profilePictureContainer {
  display: flex;
  flex-direction: column;
}

.profilePicture {
  width: 150px;
  height: 150px;
  border-radius: 50%;
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