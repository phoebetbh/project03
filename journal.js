// Retrieve favorite movies array
const favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];

// Reference to container where movies will be displayed
const container = document.getElementById("favorite-movies-container");

favoriteMovies.forEach((movieData) => {
  createMovieCard(movieData);
});

function createMovieCard(movieData) {
  const card = document.createElement("div");
  // Card styling
  card.className =
    "flex flex-col md:flex-row items-start border border-gray-300 p-4 mb-4 bg-gray-900 rounded shadow";

  // Poster Image
  const poster = document.createElement("img");
  poster.src = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;
  poster.className =
    "w-full md:w-36 h-auto object-contain mb-4 md:mb-0 md:mr-4";

  // Movie details container
  const details = document.createElement("div");
  details.className = "flex-1 max-w-xl";

  details.innerHTML = `
  <h2 class="text-xl font-semibold mb-2">${movieData.title}</h2>
  <p class="mb-1">Release Date: ${movieData.release_date || "N/A"}</p>
  <p class="mb-1">Overview: ${movieData.overview}</p>
  <p class="mb-1">Rating: ${movieData.vote_average} (${
    movieData.vote_count
  } votes)</p>
`;

  // Container for "Notes" label, textarea, and buttons
  const notesSection = document.createElement("div");
  notesSection.className = "flex-1 flex flex-col items-start mx-10 mt-4";

  // Notes label
  const notesLabel = document.createElement("label");
  notesLabel.className = "mb-1 font-bold";

  // Notes textarea
  const notesTextarea = document.createElement("textarea");
  notesTextarea.className =
    "w-full p-2 border border-gray-300 rounded resize-y min-h-[80px] mb-2 bg-white text-black";
  notesTextarea.rows = 4;

  // Initialize notes from localStorage if available
  const storedMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const currentMovie = storedMovies.find((m) => m.id === movieData.id);
  notesTextarea.value = currentMovie?.notes || "";

  // Buttons container - inline horizontally
  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "flex space-x-2";

  // Save button
  const saveNotesBtn = document.createElement("button");
  saveNotesBtn.className =
    "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded";
  saveNotesBtn.textContent = "Save Notes";
  saveNotesBtn.onclick = () => {
    saveNotes(movieData.id, notesTextarea.value);
  };

  // Remove button
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove from Favorites";
  removeBtn.className =
    "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded";
  removeBtn.onclick = () => {
    removeMovieFromFavorites(movieData.id);
    card.remove();
  };

  // Append buttons to the container
  buttonsContainer.appendChild(saveNotesBtn);
  buttonsContainer.appendChild(removeBtn);

  // Append label, textarea, and buttons container
  notesSection.appendChild(notesLabel);
  notesSection.appendChild(notesTextarea);
  notesSection.appendChild(buttonsContainer);

  // Assemble the card
  card.appendChild(poster);
  card.appendChild(details);
  card.appendChild(notesSection);

  // Append the card to your container
  container.appendChild(card);
}

// Function to save notes
function saveNotes(movieId, notes) {
  let movies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movieIndex = movies.findIndex((m) => m.id === movieId);
  if (movieIndex !== -1) {
    movies[movieIndex].notes = notes; // add/update notes
    localStorage.setItem("favoriteMovies", JSON.stringify(movies));
  }
}

// Helper function to remove a movie from localStorage
function removeMovieFromFavorites(movieId) {
  let favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  favoriteMovies = favoriteMovies.filter((m) => m.id !== movieId);
  localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
}
