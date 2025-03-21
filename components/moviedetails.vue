<template>
  <div class="movie-page">
    <div v-if="loading" class="loading">
      <loading />
    </div>

    <div v-else-if="movie" class="movie-content">
      <header class="movie-header">
        <h1>{{ movie.Title }}</h1>
      </header>

      <div class="movie-main">
        <div class="movie-poster">
          <img :src="movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'"
            :alt="`${movie.Title} Poster`" />
        </div>

        <div class="movie-info">
          <div class="info-card">
            <h2>Details</h2>
            <div class="info-item">
              <span class="label">Year:</span>
              <span class="value">{{ movie.Year }}</span>
            </div>
            <div class="info-item">
              <span class="label">Genre:</span>
              <span class="value">{{ movie.Genre }}</span>
            </div>
            <div class="info-item">
              <span class="label">Director:</span>
              <span class="value">{{ movie.Director }}</span>
            </div>
            <div class="info-item plot">
              <span class="label">Plot:</span>
              <span class="value">{{ movie.Plot }}</span>
            </div>
            <spacer />
            <div class="movie-actions">
              <div v-if="lists.length" class="dropdown-container">
                <label for="list-select">Add to List:</label>
                <select id="list-select" v-model="selectedList" class="dropdown">
                  <option value="" disabled>Select a list</option>
                  <option v-for="list in lists" :key="list._id" :value="list._id">
                    {{ list.listName }}
                  </option>
                </select>
              </div>
              <p v-else class="no-lists">No lists available. Create a list to add this movie.</p>

              <div class="action-buttons">
                <button @click="saveMovie" :disabled="isSaving || !selectedList" class="save-btn">
                  {{ isSaving ? "Saving..." : "Save Movie" }}
                </button>
                <NuxtLink to="/" class="back-btn">Go Back</NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="error">
      <p>Failed to load movie details. Please try again later.</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { user } = useUser();
const lists = ref([]);
const loading = ref(true);
const authCookie = useCookie("auth");
const router = useRouter();

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

const isSaving = ref(false);
const selectedList = ref<string | null>("");

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
      movie.value = null;
    }
  } catch (error) {
    console.error("Error fetching movie:", error);
    movie.value = null;
  }
};

const fetchLists = async () => {
  if (!user.value?.nickname) {
    console.warn("Nickname is undefined, not fetching lists yet.");
    return;
  }

  try {
    const response = await fetch(`/api/get-lists?nickname=${user.value.nickname}`, {
      headers: {
        Authorization: `Bearer ${authCookie.value}`,
      },
    });
    const data = await response.json();
    if (data.statusCode === 200) {
      lists.value = data.lists;
      console.log("Fetched lists:", lists.value);
    } else {
      console.error("Failed to fetch lists:", data.error);
    }
  } catch (error) {
    console.error("Error fetching lists:", error);
  } finally {
    loading.value = false;
  }
};

const refreshCookie = useCookie('refresh');

const refreshAuthToken = async () => {
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

const saveMovie = async () => {
  if (!selectedList.value) return;

  const token = authCookie.value;
  if (!token) {
    alert("You need to be logged in to save movies.");
    router.push("/login");
    return;
  }

  isSaving.value = true;

  try {
    console.log('Saving movie:', movie.value?.imdbID, 'to list:', selectedList.value);
    const response = await fetch("/api/add-movie-to-list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        imdbID: movie.value?.imdbID,
        title: movie.value?.Title,
        year: movie.value?.Year,
        genre: movie.value?.Genre,
        director: movie.value?.Director,
        plot: movie.value?.Plot,
        poster: movie.value?.Poster,
        listId: selectedList.value,
        nickname: user.value?.nickname,
      }),
    });

    const result = await response.json();
    console.log('Add-movie-to-list API response:', result);

    if (result.success) {
      alert("Movie saved successfully!");
    } else if (result.error === 'jwt expired') {
      const refreshed = await refreshAuthToken();
      if (refreshed) {
        await saveMovie();
      } else {
        router.push('/login');
      }
    } else {
      console.error("Failed to save movie:", result.error);
      alert(result.error || "Failed to save the movie. Please try again.");
    }
  } catch (error) {
    console.error("Error saving movie:", error);
    alert("Failed to save the movie. Please try again.");
  } finally {
    isSaving.value = false;
  }
};

watchEffect(() => {
  if (user.value?.nickname) {
    fetchLists();
  }
});

onMounted(() => {
  fetchMovieDetails();
});
</script>

<style scoped>
.movie-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 84vh;
  background-color: #000000;
  color: #ffffff;
  width: 100%;
  padding: 40px 20px;
}

.movie-content {
  max-width: 1200px;
  width: 100%;
}

.movie-header {
  text-align: center;
  margin-bottom: 40px;
}

.movie-header h1 {
  font-size: 36px;
  font-weight: bold;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.movie-main {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  justify-content: center;
}

.movie-poster {
  flex: 0 0 300px;
}

.movie-poster img {
  width: 100%;
  height: auto;
  height: 470px;
  max-height: 470px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.movie-poster img:hover {
  transform: scale(1.02);
}

.movie-info {
  flex: 1;
  min-width: 300px;
  height: 470px;
  max-height: 470px;
}

.info-card {
  background-color: #111;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.info-card h2 {
  font-size: 24px;
  font-weight: bold;
  color: rgba(221, 101, 32, 0.5);
  margin-bottom: 20px;
  text-transform: uppercase;
}

.info-item {
  display: flex;
  margin-bottom: 15px;
  font-size: 16px;
  align-items: flex-start;
}

.info-item .label {
  font-weight: bold;
  color: rgba(221, 101, 32, 0.5);
  min-width: 100px;
}

.info-item .value {
  color: #d3d3d3;
  flex: 1;
  line-height: 1.5;
}

.movie-actions {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(221, 101, 32, 0.2);
}

.dropdown-container {
  margin-bottom: 20px;
}

.dropdown-container label {
  display: block;
  font-size: 16px;
  font-weight: bold;
  color: rgba(221, 101, 32, 0.5);
  margin-bottom: 10px;
}

.dropdown {
  width: 100%;
  max-width: 300px;
  padding: 10px;
  font-size: 16px;
  border: 2px solid rgba(221, 101, 32, 0.5);
  border-radius: 10px;
  background-color: #333333;
  color: #ffffff;
  transition: border-color 0.3s ease;
}

.dropdown:focus {
  border-color: rgba(221, 101, 32, 1);
  outline: none;
}

.dropdown option {
  background-color: #333333;
  color: #ffffff;
}

.no-lists {
  font-size: 16px;
  color: #d3d3d3;
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  justify-content: flex-start;
  gap: 15px;
  flex-wrap: wrap;
}

.save-btn {
  padding: 10px 20px;
  background-color: rgba(221, 101, 32, 0.5);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-btn:hover:not(:disabled) {
  background-color: rgba(221, 101, 32, 0.7);
}

.save-btn:disabled {
  background-color: #666666;
  cursor: not-allowed;
}

.back-btn {
  padding: 10px 20px;
  background-color: #333333;
  color: #ffffff;
  border: 2px solid rgba(221, 101, 32, 0.5);
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.back-btn:hover {
  background-color: #444444;
  border-color: rgba(221, 101, 32, 0.7);
}

.loading,
.error {
  text-align: center;
  font-size: 18px;
  color: #d3d3d3;
  margin-top: 50px;
}
</style>