
// Define the Movie type
type Movie = {
  imdbID: string;
  Title: string;
  Year: string;
  Genre: string;
  Director: string;
  Plot: string;
  Poster: string;
};

// Define and export the reactive movie list state
export const myMovies = reactive<{
  movies: Movie[];
}>({
  movies: [],
});

// Define a reactive reference for nickname
const nickname = ref<string>('');

// Add a movie to the list and save it to the database
export const addMovieToMyList = async (movie: Movie) => {
  const exists = myMovies.movies.some((m) => m.imdbID === movie.imdbID);

  if (!exists) {
    // Add the movie to the local state
    myMovies.movies.push(movie);

    try {

      // Save the movie to the database
      const authCookie = useCookie('auth');
      const token = authCookie.value;
      if (!token) {
        return;
      }

      await $fetch("/api/movies", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: movie,
      });
    } catch (err) {
      console.error("Failed to save movie to the database:", err);

      // If saving fails, remove the movie from local state
      myMovies.movies = myMovies.movies.filter((m) => m.imdbID !== movie.imdbID);
    }
  } else {
    console.warn("Movie is already in your list.");
  }
};

// Remove a movie from the list and delete it from the database
export const removeMovieFromMyList = async (imdbID: string) => {
  // Optimistically remove the movie from the local state
  myMovies.movies = myMovies.movies.filter((movie) => movie.imdbID !== imdbID);

  try {
    const authCookie = useCookie('auth');
    const token = authCookie.value;
    if (!token) {
      useRouter().push('/login');
      return;
    }

    await $fetch(`/api/movies/${imdbID}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    console.error(`Failed to remove movie with ID ${imdbID} from the database:`, err);
  }
};

// Initialize movies from the database (called only once during app startup)
export const initializeMyMovies = async () => {
  try {
    const authCookie = useCookie('auth');
    const token = authCookie.value;

    // Retrieve nickname from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      nickname.value = user.nickname; // Set the nickname from localStorage
    }

    if (!token) {
      return;
    }

    // Include the nickname in the query parameters
    const response = await $fetch<{
      statusCode: number;
      result: Movie[];
    }>("/api/movies", {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        nickname: nickname.value, // Use the reactive nickname here
      },
    });

    if (response.statusCode === 200 && response.result) {
      // Populate the `myMovies` reactive state with the fetched movies
      myMovies.movies = response.result;
    } else {
      console.error("Failed to fetch movies: Unexpected response structure", response);
    }
  } catch (error) {
    console.error("Failed to initialize movies from database:", error);
  }
};