<template>
  <div class="myreviews">
    <div class="myreviewsContainer">
      <ul>
        <li>
          <div class="review">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAWWV_TzALxkkrkC-4yhP7_2DTYAa7N0cABg&s" alt="movielist" />
            <div class="info">
              <div class="post">
                <h1>Movie 1</h1>
                <p>8 ⭐</p>
              </div>
                <p class="p-dark bio">Lorem ipsum odor amet, consectetuer adipiscing elit. Neque ad metus morbi curabitur porttitor rhoncus litora hac. Venenatis praesent ac augue pharetra dapibus proin imperdiet laoreet elit. Conubia tempus nec ex pharetra tempus; a phasellus pharetra. Convallis fermentum quam condimentum dui velit ligula mus.</p>
              <div class="post">
                <p>@king</p>
                <p class="p-dark">25 January</p>
              </div>
            </div>
          </div>
        </li>
        <li>
          <div class="review">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAWWV_TzALxkkrkC-4yhP7_2DTYAa7N0cABg&s" alt="movielist" />
            <div class="info">
              <div class="post">
                <h1>Movie 2</h1>
                <p>5 ⭐</p>
              </div>
                <p class="p-dark bio">Lorem ipsum odor amet, consectetuer adipiscing elit. Neque ad metus morbi curabitur porttitor rhoncus litora hac. Venenatis praesent ac augue pharetra dapibus proin imperdiet laoreet elit. Conubia tempus nec ex pharetra tempus; a phasellus pharetra. Convallis fermentum quam condimentum dui velit ligula mus.</p>
              <div class="post">
                <p>@king</p>
                <p class="p-dark">22 January</p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style>
.myreviews {
  display: flex;
  flex-direction: row;
  max-height: 500px;
}

.myreviewsContainer {
  margin: 0 auto;
}

.review {
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding: 10px;
  width: 800px;
  height: 200px;
  max-width: 800px;
  max-height: 200px;
}

.review .info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 800px;
}

.bio {
  max-height: 100px;
  overflow: hidden;
  max-width: 350px;
}

.review h1 {
  font-size: 24px;
}

.review p {
  font-size: 16px;
}

.review img {
  width: 300px;
  height: 180px;
}

.myreviewsContainer ul {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 10px;
}

.myreviewsContainer li {
  list-style: none;
  margin: auto;
}

.p-dark {
  color: #888;
}

.post {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>