<template>
  <div v-if="movie" class="movie-details">
    <h1>{{ movie?.Title }}</h1>
    <img
      :src="movie?.Poster !== 'N/A' ? movie?.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'"
      alt="Poster"
    />
    <p><strong>Year:</strong> {{ movie?.Year }}</p>
    <p><strong>Genre:</strong> {{ movie?.Genre }}</p>
    <p><strong>Director:</strong> {{ movie?.Director }}</p>
    <p><strong>Plot:</strong> {{ movie?.Plot }}</p>

    <!-- Button dynamically changes based on whether the movie is saved -->
    <button @click="saveMovie" :disabled="isSaving || isMovieSaved">
      {{ isMovieSaved ? "Already Saved" : isSaving ? "Saving..." : "Save Movie" }}
    </button>

    <NuxtLink to="/">Go back home</NuxtLink>
  </div>
  <div v-else class="loading">
    <p>Loading movie details...</p>
  </div>
</template>

<script lang="ts" setup>
import { myMovies, addMovieToMyList } from "~/store/mylist";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";

// Movie details logic
const route = useRoute();
const imdbID = route.params.imdbID as string;

const movie = ref<null | {
  imdbID: string;
  Title: string;
  Year: string;
  Genre: string;
  Director: string;
  Plot: string;
  Poster: string;
}>(null);

const isSaving = ref(false); // Tracks if a movie is being saved
const isMovieSaved = computed(() =>
  myMovies.movies.some((m) => m.imdbID === imdbID)
); // Checks if the movie is already saved

const fetchMovieDetails = async () => {
  try {
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=9e1754f6&i=${imdbID}`
    );
    const data = await response.json();
    if (data.Response === "True") {
      movie.value = data;
    } else {
      console.error("Error fetching movie:", data.Error);
    }
  } catch (error) {
    console.error("Error fetching movie:", error);
  }
};

const saveMovie = async () => {
  if (isMovieSaved.value) return; // Prevent saving if already saved

  isSaving.value = true;

  try {
    const savedMovie = {
      imdbID: movie.value?.imdbID || "",
      Title: movie.value?.Title || "",
      Year: movie.value?.Year || "",
      Genre: movie.value?.Genre || "",
      Director: movie.value?.Director || "",
      Plot: movie.value?.Plot || "",
      Poster: movie.value?.Poster || "",
    };

    addMovieToMyList(savedMovie); // Save movie to the list
    console.log("Movie saved to list:", savedMovie);
    console.log("Current My Movies List:", myMovies.movies);
  } catch (error) {
    console.error("Error saving movie:", error);
  } finally {
    isSaving.value = false; // Reset saving state
  }
};

onMounted(() => {
  fetchMovieDetails();
});
</script>

<style scoped>
.movie-details {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 20px;
}

img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
}

p {
  font-size: 16px;
  margin: 10px 0;
}

a {
  color: #3498db;
  text-decoration: none;
  font-size: 18px;
}

a:hover {
  text-decoration: underline;
}

.loading {
  text-align: center;
  font-size: 18px;
  margin-top: 50px;
}

button {
  padding: 10px 20px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #34495e;
}
</style>
