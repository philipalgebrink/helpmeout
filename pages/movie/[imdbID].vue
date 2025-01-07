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
    <NuxtLink to="/">Go back home</NuxtLink>
  </div>
  <div v-else class="loading">
    <p>Loading movie details...</p>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";

const route = useRoute();
const imdbID = route.params.imdbID as string; // Get the dynamic param
const movie = ref<null | {
  Title: string;
  Year: string;
  Genre: string;
  Director: string;
  Plot: string;
  Poster: string;
}>(null);

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
</style>
