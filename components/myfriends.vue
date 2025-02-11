<template>
  <div class="myfriends">
    <p>My Friends ➡️</p>
    <div class="myfriendsContainer">
      <ul>
        <li>
          <img src="https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg" alt="movielist" />
          <p>@username</p>
        </li>
        <li>
          <img src="https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg" alt="movielist" />
          <p>@username</p>
        </li>
        <li>
          <img src="https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg" alt="movielist" />
          <p>@username</p>
        </li>
        <li>
          <img src="https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg" alt="movielist" />
          <p>@username</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style>
.myfriends {
  display: flex;
  flex-direction: column;
}

.myfriendsContainer {
  margin-top: 10px;
}

.myfriendsContainer ul {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  justify-items: center;
}

.myfriendsContainer li {
  display: flex;
  flex-direction: row;
  list-style: none;
  align-items: center;
  gap: 10px;
}
  
.myfriendsContainer img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>