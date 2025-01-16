<template>
  <div :class="searchClass">
    <div class="search-container">
      <!-- Input Field -->
      <input
        type="text"
        v-model="query"
        placeholder="Search for a movie..."
        @keyup.enter="fetchAllResults"
        aria-label="Search for a movie"
      />
      <!-- Search Button -->
      <button class="searchButton" @click="fetchAllResults" aria-label="Search">🔎</button>
    </div>

    <!-- Filter Options -->
    <div class="filter-container">
      <label for="rating">IMDb Rating:</label>
      <select id="rating" v-model="selectedRating">
        <option value="">All</option>
        <option value="1">1+</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
        <option value="4">4+</option>
        <option value="5">5+</option>
        <option value="6">6+</option>
        <option value="7">7+</option>
        <option value="8">8+</option>
        <option value="9">9+</option>
        <option value="10">10</option>
      </select>

      <label for="genre">Genre:</label>
      <select id="genre" v-model="selectedGenre">
        <option value="">All</option>
        <option value="Action">Action</option>
        <option value="Comedy">Comedy</option>
        <option value="Drama">Drama</option>
        <option value="Horror">Horror</option>
      </select>
    </div>

    <!-- Loading Indicator -->
    <p v-if="isLoading" class="loading">Loading...</p>

    <!-- Search Results -->
    <div v-if="displayedResults.length" class="search-results">
      <div
        v-for="movie in displayedResults"
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
            <p>IMDb Rating: {{ movie.imdbRating }}</p>
            <p>Genre: {{ movie.Genre }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        Next
      </button>
    </div>

    <!-- No Results Found -->
    <p
      v-else-if="!isLoading && !errorMessage && query.trim().length > 0 && searchResults.length === 0"
    >
      No movies found. Try another search.
    </p>
  </div>
</template>

<script lang="ts" setup>

type Movie = {
  Title: string;
  Year: string;
  imdbID: string;
  Poster: string;
  Rated: string;
  Genre: string;
  imdbRating?: string;
};

// Reactive states
const query = ref(""); // Holds the search query
const debouncedQuery = useDebounce(query, 300); // Debounced search query
const searchResults = ref<Movie[]>([]); // Holds the full search results
const displayedResults = ref<Movie[]>([]); // Holds the displayed search results for the current page
const errorMessage = ref(""); // Holds any error message
const isLoading = ref(false); // Indicates if the search is in progress
const currentPage = ref(1); // Current page
const resultsPerPage = 20; // Results per page
const totalPages = ref(1); // Total number of pages

// Filter states
const selectedRating = ref(""); // Holds the selected rating filter
const selectedGenre = ref(""); // Holds the selected genre filter

const fetchAllResults = async () => {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    const response = await fetch(`https://www.omdbapi.com/?s=${query.value}&page=${currentPage.value}&apikey=9e1754f6`);
    const data = await response.json();

    if (data.Response === "True") {
      const detailedMovies = await Promise.all(
        data.Search.map(async (movie: any) => {
          try {
            // Fetch detailed info for each movie
            const movieDetailsResponse = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=9e1754f6`);
            const movieDetails = await movieDetailsResponse.json();

            if (movieDetails.Response === "True") {
              console.log(`Fetched IMDb Rating for ${movie.Title}:`, movieDetails.imdbRating); // Log IMDb rating
              return { ...movie, imdbRating: movieDetails.imdbRating, Genre: movieDetails.Genre,}; // Add IMDb rating to the movie object
            } else {
              console.warn(`Failed to fetch details for ${movie.Title}:`, movieDetails.Error);
              return { ...movie, imdbRating: "N/A", Genre: "N/A" }; // Fallback if details fail
            }
          } catch (error) {
            console.error(`Error fetching details for ${movie.Title}:`, error);
            return { ...movie, imdbRating: "N/A", Genre: "N/A" }; // Fallback on error
          }
        })
      );

      searchResults.value = detailedMovies; // Update search results with detailed movies
      totalPages.value = Math.ceil(data.totalResults / resultsPerPage);
      applyFilters(); // Apply filters to the detailed movies
    } else {
      errorMessage.value = data.Error;
    }
  } catch (error) {
    errorMessage.value = "An error occurred while fetching data.";
    console.error("Error fetching results:", error);
  } finally {
    isLoading.value = false;
  }
};


const applyFilters = () => {
  let filteredResults = searchResults.value;

  // Apply IMDb Rating filter
  if (selectedRating.value) {
    const rating = parseInt(selectedRating.value, 10);
    filteredResults = filteredResults.filter(
      (movie) => parseFloat(movie.imdbRating || "0") >= rating
    );
  }

  // Apply Genre filter
  if (selectedGenre.value) {
    filteredResults = filteredResults.filter((movie) =>
      movie.Genre.includes(selectedGenre.value)
    );
  }

  // Paginate results
  displayedResults.value = filteredResults.slice(
    (currentPage.value - 1) * resultsPerPage,
    currentPage.value * resultsPerPage
  );
};


// Watch for changes in filters and apply them
watch([selectedRating, selectedGenre], applyFilters);

// Watch for changes in debounced query and fetch results
watch(debouncedQuery, fetchAllResults);

// Change page
const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    applyFilters();
  }
};

const searchClass = computed(() => {
  return {
    search: true,
    'results-displayed': displayedResults.value.length || isLoading.value,
  };
});
</script>

<style scoped>
.search {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 33vh;
  transition: padding-top 0.5s ease;
}

.search.results-displayed {
  padding-top: 50px;
}

.search-container {
  position: relative;
  width: 100%;
  max-width: 620px;
  padding: 0 20px;
  box-sizing: border-box;
}

.filter-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

input[type="text"] {
  padding: 20px;
  width: 100%;
  margin-bottom: 10px;
  border: 1px solid #000;
  border-radius: 20px;
  text-align: center;
  font-size: 24px;
  box-sizing: border-box;
  letter-spacing: 2px;
}

.searchButton {
  position: absolute;
  font-size: 32px;
  cursor: pointer;
  right: 21px;
  background: none;
  border: none;
  margin-top: 14px;
}

.searchButton:hover {
  font-size: 34px;
}

.error {
  color: red;
  margin-top: 10px;
}

.loading {
  margin-top: 10px;
}

.search-results {
  display: grid;
  grid-template-columns: repeat(5, minmax(350px, 1fr));
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 50px;
}

.movie-item {
  width: 300px;
  text-align: left;
  margin-bottom: 10px;
}

.movie-item:hover {
  scale: 1.10;
}

.movie-item a {
  text-decoration: none;
  color: #000;
}

.movie-details {
  
}

.movie-details h3 {
  font-size: 20px;
  letter-spacing: 1px;
}

.movie-details p {
  font-size: 16px;
}
.movie-details {
  text-align: left;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background-color: #007BFF;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin: 0 5px;
}

.pagination button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.pagination span {
  font-size: 16px;
  margin: 0 10px;
  color: #333;
}
</style>
