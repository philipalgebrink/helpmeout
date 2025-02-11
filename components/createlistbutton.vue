<template>
  <div class="dropdown" ref="dropdown">
    <button class="edit" @click="toggleDropdown">Create List</button>
    <div v-if="showDropdown" class="dropdown-content">
      <a href="#" @click="showCreateListInput">Create List</a>
      <div v-if="showInput">
        <input type="text" v-model="listName" placeholder="Enter list name" />
        <input type="text" v-model="listImage" placeholder="Enter image URL" />
        <button @click="createList">Create</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

const showDropdown = ref(false);
const showInput = ref(false);
const listName = ref('');
const listImage = ref('');
const dropdown = ref<HTMLElement | null>(null);
const router = useRouter();
const route = useRoute();
const nickname = ref(route.params.nickname as string);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function showCreateListInput() {
  showInput.value = !showInput.value;
}

async function createList() {
  try {
    const response = await fetch('/api/create-list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ listName: listName.value, listImage: listImage.value, nickname: nickname.value }),
    });

    if (response.ok) {
      alert('List created successfully');
      router.go(0);
    } else {
      console.error('Failed to create list');
    }
  } catch (error) {
    console.error('Error creating list:', error);
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

<style scoped>
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
