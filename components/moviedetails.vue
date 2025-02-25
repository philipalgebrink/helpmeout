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

    <!-- Dropdown to select a list -->
    <div v-if="!loading && lists.length" class="dropdown-container">
      <label for="list-select">Choose a list:</label>
      <select id="list-select" v-model="selectedList" class="dropdown">
        <option v-for="list in lists" :key="list._id" :value="list._id">
          {{ list.listName }}
        </option>
      </select>
    </div>

    <!-- Button dynamically changes based on whether the movie is saved -->
    <button @click="saveMovie" :disabled="isSaving || !selectedList">
      {{ isSaving ? "Saving..." : "Save Movie" }}
    </button>
    <NuxtLink to="/">
      <p>Go Back</p>
    </NuxtLink>
  </div>
  <div v-else class="loading">
    <loading />
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
const selectedList = ref<string | null>(null);

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

const fetchLists = async () => {
  if (!user.value?.nickname) {
    console.warn("Nickname is undefined, not fetching lists yet.");
    return;
  }

  try {
    const response = await fetch(`/api/get-lists?nickname=${user.value.nickname}`);
    if (response.ok) {
      const data = await response.json();
      lists.value = data.lists;
      console.log("Fetched lists:", lists.value);
    } else {
      console.error("Failed to fetch lists");
    }
  } catch (error) {
    console.error("Error fetching lists:", error);
  } finally {
    loading.value = false;
  }
};

// Save movie logic
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

    if (response.ok) {
      alert("Movie saved successfully!");
    } else {
      console.error("Failed to save movie");
    }
  } catch (error) {
    console.error("Error saving movie:", error);
    alert("Failed to save the movie. Please try again.");
  } finally {
    isSaving.value = false;
  }
};

// Fetch lists only when nickname is available
watchEffect(() => {
  if (user.value?.nickname) {
    fetchLists();
  }
});

onMounted(() => {
  fetchMovieDetails();
});
</script>

<style>
.movie-details {
  margin: auto;
  max-width: 600px;
  text-align: center;
  margin-top: 100px;
}

img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
}

h1 {
  font-size: 36px;
  margin-bottom: 10px;
}

p {
  font-size: 24px;
  margin: 10px 0;
}

a {
  color: #3498db;
  text-decoration: none;
  font-size: 24px;
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
  background-color: #83aa7a;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #34495e;
}

/* Dropdown styles */
.dropdown-container {
  margin: 20px 0;
}

.dropdown {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #727272;
  color: black;
}

.dropdown:focus {
  border-color: #3498db;
}

.dropdown option {
  padding: 10px;
color: black;
  background-color: white;
}
</style>
