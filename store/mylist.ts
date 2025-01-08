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
