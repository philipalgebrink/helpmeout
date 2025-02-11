<template>
  <div class="mylists">
    <p>My Lists ➡️</p>
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

.mylistsContainer {
  margin-top: 10px;
  width: 100%;
  height: 100%;
}

.mylistsContainer ul {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
}

.mylistsContainer li {
  list-style: none;
  align-items: center;
}
</style>