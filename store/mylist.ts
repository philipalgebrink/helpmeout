import { reactive } from "vue";

// Define and export the reactive movie list state
export const myMovies = reactive<{
  movies: {
    imdbID: string;
    Title: string;
    Year: string;
    Genre: string;
    Director: string;
    Plot: string;
    Poster: string;
  }[];
}>({
  movies: [],
});

// Add a movie to the list
export const addMovieToMyList = (movie: {
  imdbID: string;
  Title: string;
  Year: string;
  Genre: string;
  Director: string;
  Plot: string;
  Poster: string;
}) => {
  const exists = myMovies.movies.some((m) => m.imdbID === movie.imdbID);
  if (!exists) {
    myMovies.movies.push(movie);
  } else {
    console.warn("Movie is already in your list.");
  }
};

// Remove a movie from the list
export const removeMovieFromMyList = (imdbID: string) => {
  myMovies.movies = myMovies.movies.filter((movie) => movie.imdbID !== imdbID);
};

export const initializeMyMovies = async () => {
  try {
    const response = await $fetch<{
      statusCode: number;
      body: {
        message?: string;
        result?: {
          imdbID: string;
          Title: string;
          Year: string;
          Genre: string;
          Director: string;
          Plot: string;
          Poster: string;
        }[];
        error?: string;
      };
    }>("/api/movies");

    // Ensure the result exists and is an array
    const fetchedMovies = response.body.result || [];

    // Populate the reactive state
    myMovies.movies = fetchedMovies;

    console.log("Movies initialized from database:", fetchedMovies);
  } catch (error) {
    console.error("Failed to initialize movies:", error);
  }
};

