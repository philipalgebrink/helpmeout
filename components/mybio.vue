<template>
  <div class="mybio">
    <div class="aboutme">
      <h1 v-if="showButton">My Bio</h1>
      <h1 v-else>{{ nickname }}'s bio</h1>
      <div v-if="!editing">
        <p>{{ bio }}</p>
        <button v-if="showButton" @click="editText">Edit</button>
      </div>
      <form @submit="saveBio" v-else>
        <textarea v-model="bio">Editing bio text</textarea>
        <button type="submit">Save</button>
      </form>
    </div>
    <div class="favorite-movies">
      <h1 v-if="showButton">My Favorites</h1>
      <h1 v-else>{{ nickname }}'s Favorites</h1>
      <p>Show movies</p>
      <button v-if="showButton" >Edit</button>
    </div>
    <div class="favorite-directors">
      <h1 v-if="showButton">My Favorite Directors</h1>
      <h1 v-else>{{ nickname }}'s Favorite Directors</h1>
      <p>Show directors</p>
      <button v-if="showButton">Edit</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const { showButton, nickname } = useShowButton();

  // const textarea = useTemplateRef('textarea');
  // TODO: grab bio from database
  const bio = ref('Bio text');
  // console.log("textarea", textarea.value?.value);

  const editing = ref(false);
  console.log("editing.value: ", editing.value);
  const editText = () => {
    
    if (editing.value) {
      editing.value = false;
    } else {
      editing.value = true;
    }

  };

  const saveBio = (e: Event) => {
    e.preventDefault();
    console.log("bio.value: ", bio.value);
    editing.value = false;
    // TODO: Update in database
  };

  // watch (textarea.value, () => {
  //   console.log("textarea.value: ", textarea.value?.value);
  // });
  // watch (bio, () => {
  //   console.log("textarea.value: ", bio.value);
  // });

</script>

<style>

.mybio {
  width: 800px;
  height: 100%;
  max-width: 800px;
  max-height: 800px;
  margin-top: 25px;
}

.mybio {
  h1 {
    font-size: 32px;
  }
  p {
    font-size: 16px;
  }
}
.light-mode {
  .aboutme, .favorite-movies, .favorite-directors {
    background: linear-gradient(90deg, #aaa, white);
  }
}

.dark-mode {
  .aboutme, .favorite-movies, .favorite-directors {
    background: linear-gradient(90deg, #333, #000);
  }
}
.aboutme, .favorite-movies, .favorite-directors {
  width: 100%;
  height: 200px;
  margin-bottom: 20px;
  background-color: #f0f0f0;
  border-radius: 5px;
  padding: 0 20px;
}

.mybio button {
  width: 100px;
  height: 40px;
  background-color: #f0f0f0;
  border: 1px solid #000;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 85px;
}

</style>