<template>
  <div class="mylists">
    <div class="mylistsContainer">
      <ul>
        <li v-for="list in displayedLists" :key="list._id">
          <img :src="list.listImage && list.listImage !== 'N/A' ? list.listImage : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAWWV_TzALxkkrkC-4yhP7_2DTYAa7N0cABg&s'" alt="movielist" />
          <div class="listTitle">
            <p>{{ list.listName }}</p>
            <editlistbutton v-if="!list.fake" :listId="list._id" />
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
const loading = ref(true);

const fakeLists = Array.from({ length: props.maxLists }, (_, index) => ({
  _id: `fake-${index}`,
  listName: 'Loading...',
  listImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAWWV_TzALxkkrkC-4yhP7_2DTYAa7N0cABg&s',
  fake: true,
}));

const displayedLists = computed(() => (loading.value ? fakeLists : lists.value.slice(0, props.maxLists)));

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
  } finally {
    loading.value = false;
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