<template>
    <div class="dropdown" ref="dropdown">
        <div class="settingsButton">
            <img @click="toggleDropdown" src="https://www.freeiconspng.com/uploads/options-icon-30.png" alt="settings" />
            <div v-if="showDropdown" class="dropdown-content">
                <a href="#" @click="logout">LogOut</a>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useLogout } from '../composables/useLogout';

const showDropdown = ref(false);
const dropdown = ref<HTMLElement | null>(null);
const router = useRouter();
const route = useRoute();
const nickname = ref(route.params.nickname as string);
const { logout } = useLogout();

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
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
.settingsButton {
    display: inline-block;
    width: 32px;
    height: 32px;
    background-color: black;
    border-radius: 0 0 0 10px;
}

.settingsButton img {
    width: 32px;
    height: 32px;
    filter: invert(1);
}

</style>