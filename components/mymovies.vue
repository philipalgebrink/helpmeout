<template>
  <div class="my-movies">
    <h2>My Movies</h2>
    <div v-if="movies.length" class="movie-grid">
      <div v-for="movie in movies" :key="movie.imdbID" class="movie-item">
        <img
          :src="movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150x225?text=No+Poster'"
          alt="Poster"
        />
        <div class="movie-details">
          <h3>{{ movie.Title }}</h3>
          <p>{{ movie.Year }}</p>
          <button @click="removeMovie(movie.imdbID)">Remove</button>
        </div>
      </div>
    </div>
    <p v-else>No movies saved yet.</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { myMovies, removeMovieFromMyList } from "@/store/mylist";

// Define a type for a movie
type Movie = {
  imdbID: string;
  Title: string;
  Year: string;
  Genre: string;
  Director: string;
  Plot: string;
  Poster: string;
};

// Local state to hold movies
const movies = ref<Movie[]>([]); // Use Movie[] type to specify the structure of movies

// Fetch movies from the database
const fetchMoviesFromDB = async () => {
  try {
    const fetchedMovies = await $fetch<Movie[]>("/api/movies"); // Ensure API returns an array of Movie
    movies.value = fetchedMovies; // Populate local state with fetched movies
    console.log("Fetched movies:", fetchedMovies);
  } catch (error) {
    console.error("Failed to fetch movies:", error);
  }
};

// Remove a movie from the list
const removeMovie = (imdbID: string) => {
  removeMovieFromMyList(imdbID); // Update reactive store
  movies.value = movies.value.filter((movie) => movie.imdbID !== imdbID); // Update local state
};

// Fetch movies when the component is mounted
onMounted(() => {
  fetchMoviesFromDB();
});
</script>


<style scoped>

h2 {
  letter-spacing: 2px;
}
.my-movies {
  padding: 20px;
  text-align: center;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 20px;
  width: 100%;
  max-width: 900px;
}

.movie-item {
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
  margin: 10px 0;
}

.movie-details p {
  font-size: 14px;
  color: #555;
}

button {
  padding: 8px 16px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background-color: #c0392b;
}
</style>
