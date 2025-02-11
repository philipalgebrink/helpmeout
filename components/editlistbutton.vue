<template>
  <div class="dropdown" ref="dropdown">
    <button class="edit" @click="toggleDropdown">Edit</button>
    <div v-if="showDropdown" class="dropdown-content">
      <a href="#" @click="showEditNameInput">Change List Name</a>
      <div v-if="showInputName">
        <input type="text" v-model="listName" placeholder="Enter new list name" />
        <button @click="saveListName">Save</button>
      </div>
      <a href="#" @click="showEditImageInput">Change List Image</a>
      <div v-if="showInputImage">
        <input type="text" v-model="listImage" placeholder="Enter new image URL" />
        <button @click="saveListImage">Save</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  listId: {
    type: String,
    required: true,
  },
});

const showDropdown = ref(false);
const showInputName = ref(false);
const showInputImage = ref(false);
const listName = ref('');
const listImage = ref('');
const dropdown = ref<HTMLElement | null>(null);
const router = useRouter();

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function showEditNameInput() {
  showInputName.value = !showInputName.value;
}

function showEditImageInput() {
  showInputImage.value = !showInputImage.value;
}

async function saveListName() {
  try {
    const response = await fetch('/api/edit-list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ listId: props.listId, listName: listName.value }),
    });

    if (response.ok) {
      alert('List name updated successfully');
      router.go(0); // Refresh the page to show the updated list name
    } else {
      console.error('Failed to update list name');
    }
  } catch (error) {
    console.error('Error updating list name:', error);
  }
}

async function saveListImage() {
  try {
    const response = await fetch('/api/edit-list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ listId: props.listId, listImage: listImage.value }),
    });

    if (response.ok) {
      alert('List image updated successfully');
      router.go(0); // Refresh the page to show the updated list image
    } else {
      console.error('Failed to update list image');
    }
  } catch (error) {
    console.error('Error updating list image:', error);
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