<template>
  <div class="dropdown" ref="dropdown">
    <button class="edit" @click="toggleDropdown">Edit</button>
    <div v-if="showDropdown" class="dropdown-content">
      <a href="#" @click="showProfilePictureInput">Change Profile Picture</a>
      <div v-if="showInputPicture">
        <input type="text" v-model="profilePictureUrl" placeholder="Enter image URL" />
        <button @click="saveProfilePicture">Save</button>
      </div>
      <a href="#" @click="showProfileBannerInput">Change Profile Banner</a>
      <div v-if="showInputBanner">
        <input type="text" v-model="profileBannerUrl" placeholder="Enter image URL" />
        <button @click="saveProfileBanner">Save</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const showDropdown = ref(false);
const showInputPicture = ref(false);
const showInputBanner = ref(false);
const profilePictureUrl = ref('');
const profileBannerUrl = ref('');
const dropdown = ref<HTMLElement | null>(null);
const router = useRouter();
const route = useRoute();
const nickname = ref(route.params.nickname as string);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function showProfilePictureInput() {
  if (showInputPicture.value == false)
  {
    showInputPicture.value = true;
  }
  else {
    showInputPicture.value = false;
  }
}

function showProfileBannerInput() {
  if (showInputBanner.value == false)
  {
    showInputBanner.value = true;
  }
  else {
    showInputBanner.value = false;
  }
}

async function saveProfilePicture() {
  try {
    const response = await fetch('/api/profile-picture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profilePictureUrl: profilePictureUrl.value, nickname: nickname.value }),
    });

    if (response.ok) {
      alert('Profile picture updated successfully');
      router.go(0); // Refresh the page to show the updated profile picture
    } else {
      console.error('Failed to update profile picture');
    }
  } catch (error) {
    console.error('Error updating profile picture:', error);
  }
}

async function saveProfileBanner() {
  try {
    const response = await fetch('/api/profile-banner', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profileBannerUrl: profileBannerUrl.value, nickname: nickname.value }),
    });

    if (response.ok) {
      alert('Profile banner updated successfully');
      router.go(0);
    } else {
      console.error('Failed to update banner picture');
    }
  } catch (error) {
    console.error('Error updating banner picture:', error);
  }
}

function handleClickOutside(event: MouseEvent) {
  if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
    showDropdown.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style>
.edit {
  background-color: black;
  border: solid 1px white;
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

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: white;
  width: 230px;
  max-width: 230px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  font-size: 24px;
  border-radius: 12px;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #ddd;
}

.dropdown-content {
  display: block;
}
</style>