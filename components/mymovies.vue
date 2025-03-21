<template>
  <div class="mymovies">
    <div v-if="isLoading" class="loading">Loading...</div>
    <div v-else-if="displayedMovies.length" class="mymovies-results">
      <div class="movie-grid">
        <div v-for="movie in displayedMovies" :key="movie.imdbID" class="movie-item">
          <NuxtLink :to="`/movie/${movie.imdbID}`">
            <img
              :src="movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Poster'"
              alt="Poster" class="movie-poster" />
            <div class="movie-details">
              <h3>{{ movie.Title }}</h3>
              <p>Year: {{ movie.Year || 'N/A' }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
    <p v-else class="no-results">No movies found in this list.</p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  listId: {
    type: String,
    required: true,
  },
});

const movies = ref<any[]>([]);
const isLoading = ref(true);

const fakeMovies = Array.from({ length: 4 }, (_, index) => ({
  imdbID: `fake-${index}`,
  Title: 'Loading...',
  Poster: 'https://via.placeholder.com/200x300?text=Loading',
  Year: 'N/A',
  fake: true,
}));

const displayedMovies = computed(() =>
  isLoading.value ? fakeMovies : movies.value
);

const authCookie = useCookie('auth');
const router = useRouter();

const fetchMovies = async () => {
  const token = authCookie.value;
  if (!token) {
    console.error('You need to be logged in to fetch movies.');
    router.push('/login');
    return;
  }

  try {
    console.log('Fetching movies for list ID:', props.listId);
    const response = await fetch(`/api/lists/get-movies-by-list?listId=${props.listId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    console.log('Get-movies-by-list API response:', result);

    if (result.success) {
      // Fetch additional details from OMDB API for each movie
      const detailedMovies = await Promise.all(
        result.movies.map(async (movie: any) => {
          try {
            const movieDetailsResponse = await fetch(
              `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=9e1754f6`
            );
            const movieDetails = await movieDetailsResponse.json();

            if (movieDetails.Response === "True") {
              return {
                imdbID: movie.imdbID,
                Title: movieDetails.Title,
                Poster: movieDetails.Poster,
                Year: movieDetails.Year,
              };
            } else {
              console.warn(`Failed to fetch details for ${movie.title}:`, movieDetails.Error);
              return {
                imdbID: movie.imdbID,
                Title: movie.title,
                Poster: movie.poster || 'https://via.placeholder.com/200x300?text=No+Poster',
                Year: 'N/A',
              };
            }
          } catch (error) {
            console.error(`Error fetching details for ${movie.title}:`, error);
            return {
              imdbID: movie.imdbID,
              Title: movie.title,
              Poster: movie.poster || 'https://via.placeholder.com/200x300?text=No+Poster',
              Year: 'N/A',
            };
          }
        })
      );

      movies.value = detailedMovies;
    } else if (result.error === 'jwt expired') {
      const refreshed = await refreshAuthToken();
      if (refreshed) {
        await fetchMovies();
      } else {
        router.push('/login');
      }
    } else {
      console.error('Failed to fetch movies:', result.error);
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
  } finally {
    isLoading.value = false;
  }
};

const refreshAuthToken = async () => {
  const refreshCookie = useCookie('refresh');
  try {
    console.log('Attempting to refresh token...');
    console.log('Refresh token:', refreshCookie.value);
    const response = await fetch('/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshCookie.value}`,
      },
    });

    const result = await response.json();
    console.log('Refresh token API response:', result);

    if (result.success || response.ok) {
      const newToken = result.token;
      if (!newToken) {
        console.error('New token not found in response');
        return false;
      }
      authCookie.value = newToken;
      console.log('Token refreshed successfully, new token:', newToken);
      return true;
    } else {
      console.error('Failed to refresh token:', result.error || 'Unknown error');
      return false;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
};

onMounted(async () => {
  await fetchMovies();
});
</script>

<style scoped>
.mymovies {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 84vh;
  background-color: #000000;
  color: #ffffff;
  width: 800px;
  margin: 0 auto;
}

.mymovies-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 70px 20px 20px;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  justify-items: center;
  width: 100%;
  max-width: 1200px;
}

.movie-item {
  width: 100%;
  height: 450px;
  text-align: center;
  transition: transform 0.3s ease;
  max-width: 450px;
}

.movie-item:hover {
  transform: scale(1.05);
}

.movie-item a {
  text-decoration: none;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
}

.movie-poster {
  width: 100%;
  height: 85%;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
}

.movie-details {
  padding: 10px 0;
  text-align: center;
  background-color: #111;
  width: 100%;
  height: 15%;
  border-radius: 0 0 5px 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.movie-details h3 {
  font-size: 16px;
  font-weight: bold;
  margin: 5px 0;
  color: rgba(221, 101, 32, 0.5);
  text-transform: uppercase;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.movie-details p {
  font-size: 14px;
  margin: 0;
  color: #d3d3d3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.loading,
.no-results {
  text-align: center;
  margin-top: 20px;
  color: #d3d3d3;
}

@media (max-width: 1024px) {
  .movie-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}

@media (max-width: 600px) {
  .movie-grid {
    grid-template-columns: 1fr;
  }

  .movie-item {
    max-width: 100%;
  }
}
</style>