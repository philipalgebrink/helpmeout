<template>
  <div class="search">
    <div class="search-container">
  <input
    type="text"
    v-model="query"
    placeholder="Search for a movie..."
    @input="handleInput"
  />
  <button @click="searchMovies">🔎</button>
</div>


    <div v-if="searchResults.length" class="search-results">
      <div
        v-for="movie in searchResults"
        :key="movie.imdbID"
        class="movie-item"
      >
        <NuxtLink :to="`/movie/${movie.imdbID}`">
          <img
            :src="movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150x225?text=No+Poster'"
            alt="Poster"
          />
          <div class="movie-details">
            <h3>{{ movie.Title }}</h3>
            <p>Year: {{ movie.Year }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
type Movie = {
  Title: string,
  Year: string,
  imdbID: string,
  Poster: string,
};

const query = ref(""); // Holds the search query
const searchResults: Ref<Movie[]> = ref([]); // Holds the search results

const searchMovies = async () => {
  if (!query.value.trim()) {
    alert("Please enter a search term");
    return;
  }

  try {
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=9e1754f6&s=${query.value}`
    );
    const data = await response.json();

    if (data.Response === "True") {
      searchResults.value = data.Search;
    } else {
      alert(data.Error); // Show error from API
      searchResults.value = [];
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

const handleInput = () => {
  if (query.value.length === 0) {
    searchResults.value = []; // Clear results if query is cleared
  }
};
</script>

<style scoped>
.search {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10%;
}

.search-container {
  position: relative; /* Enable relative positioning for the container */
  width: 620px; /* Adjust width as needed */
}

input[type="text"] {
  padding: 10px;
  width: 100%; /* Full width for the input */
  height: 100px;
  margin-bottom: 10px;
  border: 1px solid #000000;
  border-radius: 20px;
  text-align: center;
  font-size: 36px;
  box-sizing: border-box; /* Ensure padding is included in the width */
}

button {
  position: absolute; /* Position the button inside the container */
  top: 45%; /* Center vertically */
  right: 15px; /* Adjust distance from the right */
  transform: translateY(-50%); /* Adjust for vertical alignment */
  font-size: 36px;
  border: none;
  background: none; /* Remove background for transparency */
  cursor: pointer;
  color: #000; /* Adjust color as needed */
}


.search-results {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  width: 100%;
  max-width: 900px;
  margin-top: 5%;
}

.movie-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  background-color: #fff;
  transition: transform 0.3s, box-shadow 0.3s;
}

.movie-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.movie-item img {
  width: 150px;
  height: 225px;
  object-fit: cover;
  border-radius: 4px;
}

.movie-details h3 {
  font-size: 16px;
  margin: 10px 0 5px;
}

.movie-details p {
  font-size: 14px;
  color: #555;
}
</style>
