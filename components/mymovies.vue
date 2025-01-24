<template>
  <div class="mymovies-container">
    <h2>My Movies</h2>
    <div v-if="movies.length" class="my-movies">
      <div v-for="movie in movies" :key="movie.imdbID" class="movie-item">
      <NuxtLink style="text-decoration: none; color: inherit;" :to="`/movie/${movie.imdbID}`">
        <img
          :src="movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150x225?text=No+Poster'"
          alt="Poster"
        />
        <div class="movie-details">
          <h3>{{ movie.Title }}</h3>
          <p>{{ movie.Year }}</p>
        </div>
      </NuxtLink>
      <button @click="removeMovie(movie.imdbID)">Remove</button>
      </div>
    </div>
    <p v-else>No movies saved yet or unable to fetch data.</p>
  </div>
</template>

<script lang="ts" setup>
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
const authCookie = useCookie('auth');
const router = useRouter();

// Fetch movies from the API
const fetchMovies = async () => {
  try {
    const token = authCookie.value;
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
    const token = authCookie.value;
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

.mymovies-container {
  margin-top: 20px;
  text-align: center;
  margin-bottom: 50px;
}

.my-movies {
  display: grid;
  grid-template-columns: repeat(5, minmax(350px, 1fr));
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.movie-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 300px;
  height: 600px;
  text-align: left;
}

.movie-item img {
  width: 100%;
  height: 450px;
  object-fit: cover;
  border-radius: 10px;
}

.movie-item:hover {
  scale: 1.10;
}

.movie-item a {
  text-decoration: none;
  color: #000;
}

.movie-details {
  text-align: left;
}

.movie-details h3 {
  font-size: 20px;
  letter-spacing: 1px;
}

.movie-details p {
  font-size: 16px;
}

.movie-item button {
  margin-top: 20px;
  background-color: #f44336;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 120px;
}

</style>