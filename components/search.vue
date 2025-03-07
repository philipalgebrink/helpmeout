<template>
  <div class="search">
    <div class="search-container">
      <div class="search-input-wrapper">
        <input type="text" v-model="query" placeholder="Search for a movie..." @keyup.enter="fetchAllResults"
          aria-label="Search for a movie" class="search-input" />
      </div>
      <div class="filter-container">
        <label for="rating" class="filter-label">IMDb Rating:</label>
        <select id="rating" v-model="selectedRating" class="filter-select">
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

        <label for="genre" class="filter-label">Genre:</label>
        <select id="genre" v-model="selectedGenre" class="filter-select">
          <option value="">All</option>
          <option value="Action">Action</option>
          <option value="Comedy">Comedy</option>
          <option value="Drama">Drama</option>
          <option value="Horror">Horror</option>
        </select>
      </div>
    </div>

    <p v-if="isLoading" class="loading">Loading...</p>

    <div v-if="displayedResults.length" class="search-results">
      <div class="movie-grid">
        <div v-for="movie in displayedResults" :key="movie.imdbID" class="movie-item">
          <NuxtLink :to="`/movie/${movie.imdbID}`">
            <img :src="movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Poster'"
              alt="Poster" class="movie-poster" />
            <div class="movie-details">
              <h3>{{ movie.Title }}</h3>
              <p>Year: {{ movie.Year }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
      <div v-if="totalPages > 1" class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="pagination-btn">
          Previous
        </button>
        <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="pagination-btn">
          Next
        </button>
      </div>
    </div>

    <p v-else-if="!isLoading && !errorMessage && query.trim().length > 0 && searchResults.length === 0"
      class="no-results">
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

const query = ref("");
const debouncedQuery = useDebounce(query, 300);
const searchResults = ref<Movie[]>([]);
const displayedResults = ref<Movie[]>([]);
const errorMessage = ref("");
const isLoading = ref(false);
const currentPage = ref(1);
const resultsPerPage = 9;
const totalPages = ref(1);

const selectedRating = ref("");
const selectedGenre = ref("");
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
            const movieDetailsResponse = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=9e1754f6`);
            const movieDetails = await movieDetailsResponse.json();

            if (movieDetails.Response === "True") {
              return { ...movie, imdbRating: movieDetails.imdbRating, Genre: movieDetails.Genre };
            } else {
              console.warn(`Failed to fetch details for ${movie.Title}:`, movieDetails.Error);
              return { ...movie, imdbRating: "N/A", Genre: "N/A" };
            }
          } catch (error) {
            console.error(`Error fetching details for ${movie.Title}:`, error);
            return { ...movie, imdbRating: "N/A", Genre: "N/A" };
          }
        })
      );

      searchResults.value = detailedMovies;
      totalPages.value = Math.ceil(data.totalResults / resultsPerPage);
      applyFilters();
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

const handleSearch = () => {
  fetchAllResults();
  (document.activeElement as HTMLElement).blur();
  (document.querySelector('.search-input') as HTMLElement)?.focus();
};

const applyFilters = () => {
  let filteredResults = searchResults.value;

  if (selectedRating.value) {
    const rating = parseInt(selectedRating.value, 10);
    filteredResults = filteredResults.filter(
      (movie) => parseFloat(movie.imdbRating || "0") >= rating
    );
  }

  if (selectedGenre.value) {
    filteredResults = filteredResults.filter((movie) =>
      movie.Genre.includes(selectedGenre.value)
    );
  }

  displayedResults.value = filteredResults.slice(
    (currentPage.value - 1) * resultsPerPage,
    currentPage.value * resultsPerPage
  );
};

watch([selectedRating, selectedGenre], applyFilters);

watch(debouncedQuery, fetchAllResults);

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    applyFilters();
  }
};
</script>

<style scoped>
.search {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 84vh;
  background-color: #000000;
  color: #ffffff;
  width: 800px;
  margin: 0 auto;
}

.search-container {
  width: 100%;
  max-width: 620px;
  padding: 0 20px;
  box-sizing: border-box;
  margin: 50px auto 0;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  gap: 10px;
}

.search-input {
  padding: 15px 20px;
  flex: 1;
  border: 2px solid rgba(221, 101, 32, 0.5);
  border-radius: 20px;
  font-size: 18px;
  color: #ffffff;
  background-color: #333333;
  text-align: center;
  letter-spacing: 1px;
}

.search-input::placeholder {
  color: #d3d3d3;
}

.filter-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.filter-label {
  color: rgba(221, 101, 32, 0.5);
  font-weight: bold;
  margin-right: 10px;
}

.filter-select {
  padding: 10px;
  border: 2px solid rgba(221, 101, 32, 0.5);
  border-radius: 10px;
  background-color: #333333;
  color: #ffffff;
  font-size: 16px;
}

.filter-select option {
  background-color: #333333;
  color: #ffffff;
}

.loading,
.no-results {
  text-align: center;
  margin-top: 20px;
  color: #d3d3d3;
}

.search-results {
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

.pagination-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background-color: rgba(221, 101, 32, 0.5);
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  margin: 0 10px;
}

.pagination-btn:disabled {
  background-color: #666666;
  cursor: not-allowed;
}

.pagination-info {
  color: #d3d3d3;
  margin: 0 10px;
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

  .search-input-wrapper {
    flex-direction: column;
    gap: 10px;
  }

  .search-input {
    width: 100%;
  }
}
</style>