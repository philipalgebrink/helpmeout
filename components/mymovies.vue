<template>
  <div v-if="nickname">
    <div v-if="movies.length" class="my-movies">
      <div v-for="movie in movies" :key="movie.imdbID" class="movie-item">
        <NuxtLink :to="`/movie/${movie.imdbID}`">
          <img :src="movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150x225?text=No+Poster'" alt="Poster" />
          <div class="movie-details">
            <h3>{{ movie.Title }}</h3>
            <p>{{ movie.Year }}</p>
          </div>
        </NuxtLink>
        <button @click="removeMovie(movie.imdbID)">Remove</button>
      </div>
    </div>
    <p v-else>No movies saved yet or unable to fetch data.</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script lang="ts" setup>
type Movie = {
  imdbID: string;
  Title: string;
  Year: string;
  Genre: string;
  Director: string;
  Plot: string;
  Poster: string;
};

const movies = ref<Movie[]>([]);
const errorMessage = ref<string | null>(null);
const authCookie = useCookie('auth');
const router = useRouter();
const route = useRoute();
const nickname = ref(route.params.nickname as string);

const checkAuthToken = () => {
  const token = authCookie.value;
  if (!token) {
    router.push('/login');
    return false;
  }
  return true;
};

const fetchMovies = async () => {
  errorMessage.value = null; // Clear previous error
  try {
    if (!checkAuthToken()) return;

    if (!nickname.value) {
      console.error('Nickname is missing before API call:', nickname.value);
      return;
    }

    const apiUrl = `/api/movies?nickname=${nickname.value}`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${authCookie.value}`,
      },
    });

    const responseData = await response.json();

    if (response.ok) {
      movies.value = responseData.result;
    } else {
      errorMessage.value = 'Failed to fetch movies.';
      console.error('Failed to fetch movies:', responseData);
    }
  } catch (error) {
    errorMessage.value = 'Error fetching movies.';
    console.error('Error fetching movies:', error);
  }
};

const removeMovie = async (imdbID: string) => {
  errorMessage.value = null; // Clear previous error
  try {
    if (!checkAuthToken()) return;

    const response = await fetch(`/api/movies/${imdbID}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authCookie.value}`,
      },
    });

    if (response.ok) {
      const index = movies.value.findIndex((movie) => movie.imdbID === imdbID);
      if (index !== -1) {
        movies.value.splice(index, 1); // Remove the movie directly from the array
      }
    } else {
      errorMessage.value = 'Failed to delete movie.';
      console.error('Failed to delete movie:', await response.json());
    }
  } catch (error) {
    errorMessage.value = 'Error deleting movie.';
    console.error('Error deleting movie:', error);
  }
};

onMounted(() => {
  if (nickname.value) {
    fetchMovies();
  }
});

watch(() => route.params.nickname, (newNickname, oldNickname) => {
  if (newNickname && newNickname !== oldNickname) {
    fetchMovies();
  }
});
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
  margin: 0 auto;
}

.movie-details h3 {
  font-size: 20px;
  letter-spacing: 1px;
}

.light-mode h3, .light-mode p {
  color: black;
}
.dark-mode h3, .dark-mode p {
  color: white;
}

.movie-details p {
  font-size: 16px;
}

.movie-item button {
  background-color: #f44336;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 120px;
}

.error {
  color: red;
  font-size: 16px;
  margin-top: 20px;
}
</style>
