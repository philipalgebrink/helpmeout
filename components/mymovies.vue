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
    <p v-else>No movies saved yet or unable to fetch data.</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useCookies } from '@vueuse/integrations/useCookies';
import { useRouter } from 'vue-router';

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
const cookies = useCookies(['auth']);
const router = useRouter();

// Fetch movies from the API
const fetchMovies = async () => {
  try {
    const token = cookies.get('auth');
    if (!token) {
      router.push('/login');
      return;
    }

    const response = await fetch('/api/movies', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      movies.value = data.result;
    } else {
      console.error('Failed to fetch movies:', await response.json());
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
};

// Remove a movie from the list
const removeMovie = async (imdbID: string) => {
  try {
    const token = cookies.get('auth');
    if (!token) {
      router.push('/login');
      return;
    }

    const response = await fetch(`/api/movies/${imdbID}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      // Update local state
      movies.value = movies.value.filter((movie) => movie.imdbID !== imdbID);
    } else {
      console.error('Failed to delete movie:', await response.json());
    }
  } catch (error) {
    console.error('Error deleting movie:', error);
  }
};

// Fetch movies when the component is mounted
onMounted(fetchMovies);
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
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
.movie-item {
  width: 150px;
  text-align: center;
}
.movie-details {
  margin-top: 10px;
}
</style>