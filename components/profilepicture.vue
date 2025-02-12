<template>
  <img class="profilePicture" :src="profilePictureUrl" alt="profile picture" />
</template>

<script lang="ts" setup>
const { showButton, nickname } = useShowButton();
const profilePictureUrl = ref('https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=');

onMounted(async () => {
  try {
    const response = await fetch(`/api/profile-picture?nickname=${nickname.value}`);
    if (response.ok) {
      const data = await response.json();
      profilePictureUrl.value = data.profilePictureUrl || profilePictureUrl.value;
    } else {
      console.error('Failed to fetch profile picture');
    }
  } catch (error) {
    console.error('Error fetching profile picture:', error);
  }
});
</script>

<style>
  .profilePicture {
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }
</style>