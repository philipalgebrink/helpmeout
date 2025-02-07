<template>
  <div class="mylists">
    <div class="mylistsHeader">
      <p>My Lists ➡️</p>
    </div>
    <div class="mylistsContainer">
      <ul>
        <li>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAWWV_TzALxkkrkC-4yhP7_2DTYAa7N0cABg&s" alt="movielist" />
          <p>Feel Good</p>
        </li>
        <li>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAWWV_TzALxkkrkC-4yhP7_2DTYAa7N0cABg&s" alt="movielist" />
          <p>Christmas</p>
        </li>
        <li>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAWWV_TzALxkkrkC-4yhP7_2DTYAa7N0cABg&s" alt="movielist" />
          <p>GOATs</p>
        </li>
        <li>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAWWV_TzALxkkrkC-4yhP7_2DTYAa7N0cABg&s" alt="movielist" />
          <p>Halloween</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style>
.mylists {
  display: flex;
  flex-direction: column;
}

.mylistsHeader {
  display: flex;
  align-items: center;
}

.mylistsContainer {
  margin-top: 10px;
}

.mylistsContainer ul {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.mylistsContainer li {
  list-style: none;
  margin: auto;
}
</style>