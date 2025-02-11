<template>
  <div class="mylists">
    <div class="titleContainer">
      <p>My Lists ➡️</p>
      <createlistbutton v-if="showButton" />
    </div>
    <div class="mylistsContainer">
      <ul>
        <li v-for="list in lists.slice(0, maxLists)" :key="list._id">
          <img :src="list.listImage && list.listImage !== 'N/A' ? list.listImage : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAWWV_TzALxkkrkC-4yhP7_2DTYAa7N0cABg&s'" alt="movielist" />
          <div class="listTitle">
            <p>{{ list.listName }}</p>
            <editlistbutton :listId="list._id" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  maxLists: {
    type: Number,
    default: 8,
  }
});

const { showButton, nickname } = useShowButton();
const lists = ref([]);

onMounted(async () => {
  try {
    const response = await fetch(`/api/get-lists?nickname=${nickname.value}`);
    if (response.ok) {
      const data = await response.json();
      lists.value = data.lists;
    } else {
      console.error('Failed to fetch lists');
    }
  } catch (error) {
    console.error('Error fetching lists:', error);
  }
});
</script>

<style scoped>
.mylists {
  display: flex;
  flex-direction: column;
  max-height: 600px;
}

.titleContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mylistsContainer {
  margin-top: 10px;
  width: 100%;
  height: 100%;
}

.mylistsContainer ul {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-items: center;
  gap: 10px;
}

.mylistsContainer li {
  list-style: none;
  align-items: center;
}

.mylistsContainer img {
  width: 180px;
  height: 180px;
  object-fit: cover;
}

.listTitle {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}
</style>