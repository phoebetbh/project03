//const { cache } = require("react");

// Initial Values
// Global variable for API KEY resource, image resource and search path for movies database

const API_KEY = "269c98cfbe888b4682f1c9a9ef9ebaee";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const url =
  "https://api.themoviedb.org/3/search/movie?api_key=269c98cfbe888b4682f1c9a9ef9ebaee";

// Selecting elements from the DOM
// Elements that need to access to the the value of movie, for user-interaction eg: search a movie, 2 containers for search movies and reach the movies
const buttonElement = document.querySelector("#search");
const inputElement = document.querySelector("#inputValue");
const movieSearchable = document.querySelector("#movies-searchable");
const moviesContainer = document.querySelector("#movies-container");

function generateUrl(path) {
  const url = `https://api.themoviedb.org/3${path}?api_key=269c98cfbe888b4682f1c9a9ef9ebaee`;
  return url;
}

function requestMovie(url, onComplete, onError) {
  fetch(url)
    .then((res) => res.json())
    .then(onComplete)
    .catch(onError);
}

// movies.map function is not necessary here, other option is use ForEach instead
// the whole function is to create img for each movie and put in 1 section container
function movieSection(movies) {
  const section = document.createElement("section");
  section.className = "flex overflow-x-auto space-x-4 p-2";

  movies.forEach((movie) => {
    if (movie.poster_path) {
      const img = document.createElement("img");
      img.src = IMAGE_URL + movie.poster_path;
      img.setAttribute("data-movie-id", movie.id);
      img.className =
        "w-72 transition-transform duration-300 hover:scale-110 cursor-pointer";
      section.appendChild(img);
    }
  });
  return section;
}

//Create movies list multiple values for the keyword that user search eg"star wars"
//parameter array with "movies", this array is contain Json(dict) for each movie
function createMovieContainer(movies, title = "") {
  const movieElement = document.createElement("div");
  // Container styling
  movieElement.className = "mb-8";

  const header = document.createElement("h2");
  header.innerHTML = title;
  header.className = "text-xl font-semibold mb-4 text-gray-200";

  const content = document.createElement("div");
  content.className = "content"; // To toggle display

  const contentClose = `<p id="content-close" class="cursor-pointer text-red-500 font-bold">X</p>`;
  content.innerHTML = contentClose;

  const section = movieSection(movies);
  movieElement.appendChild(header);
  movieElement.appendChild(section);
  movieElement.appendChild(content);
  return movieElement;
}

//Function to retrieve data and render the movie, by nested dict to get the key and value of each movies data eg: name, released date etc
function renderSearchMovies(data) {
  movieSearchable.innerHTML = ""; // delete any content in div with class movies-searchable
  const movies = data.results; //get the result Array inside the origin response JSON (dict) frm website; each entry = 1 movie
  const movieBlock = createMovieContainer(movies);
  movieSearchable.appendChild(movieBlock); // add the result to empty div with class movies-searchable
  console.log("Data: ", data);
}

function renderMovies(data) {
  const movies = data.results;
  const title = this?.title || "";
  const movieBlock = createMovieContainer(movies, title);
  moviesContainer.appendChild(movieBlock);
}

function searchMovie(value) {
  const path = "/search/movie";
  const url = generateUrl(path) + "&query=" + encodeURIComponent(value);
  requestMovie(url, renderSearchMovies, handleError);
}

function handleError(error) {
  console.log("Error: ", error);
}

// User click button for search a movie. Path of URL and query of movie database. give "" for user input the value(what's the content that user want to search)
buttonElement.onclick = function (event) {
  event.preventDefault();
  const value = inputElement.value;
  const path = "/search/movie";
  const newUrl = generateUrl(path) + "&query=" + value;
  fetchMovie(value, newUrl);
  inputElement.value = "";
};

function fetchMovie(movieName, newUrl) {
  result = fetch(newUrl)
    .then((res) => res.json())
    .then(renderSearchMovies)
    .catch((error) => {
      console.log("Error:", error);
    });
}

function createIframe(video) {
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube.com/embed/${video.key}`;
  iframe.width = 360;
  iframe.height = 315;
  iframe.allowFullscreen = true;

  return iframe;
}

function createVideoTemplate(data, content) {
  content.innerHTML =
    '<p id="content-close" class="cursor-pointer text-red-500 font-bold">X</p>';
  const videos = data.results;
  const length = Math.min(4, videos.length);
  const iframeContainer = document.createElement("div");
  iframeContainer.className = "flex flex-col md:flex-row gap-4";

  for (let i = 0; i < length; i++) {
    const video = videos[i];
    const iframe = createIframe(video);
    iframeContainer.appendChild(iframe);
  }
  content.appendChild(iframeContainer);
}

// Event Delegation
// if statement target only do something when click event on the img
// when click on img and render the movie's card
// target.dataset.movieId the movieID is the attribute of the img element
document.onclick = function (event) {
  const target = event.target;

  if (target.tagName.toLowerCase() === "img") {
    const movieId = target.dataset.movieId;
    const section = event.target.parentElement;
    const content = section.nextElementSibling;

    // Show the content
    content.classList.add("block");
    content.classList.remove("hidden");

    const path = `/movie/${movieId}/videos`;
    const url = generateUrl(path);

    fetch(url)
      .then((res) => res.json())
      .then((data) => createVideoTemplate(data, content))
      .catch((error) => console.log("Error:", error));

    // Fetch movie info
    getMovieInformation(movieId).then((movieData) => {
      if (movieData) {
        const card = createMovieCard(movieData);
        const cardContainer = document.createElement("div");
        cardContainer.className = "movie-card-container";

        // Remove existing card if any
        const existingCard = document.querySelector(".movie-card-container");
        if (existingCard) existingCard.remove();

        // Insert after #content-close
        const contentCloseP = document.querySelector("#content-close");
        if (contentCloseP) {
          contentCloseP.insertAdjacentElement("afterend", cardContainer);
        } else {
          document.querySelector(".content")?.appendChild(cardContainer);
        }
        cardContainer.appendChild(card);
      }
    });
  }

  if (target.id === "content-close") {
    const content = target.parentElement;
    content.classList.remove("block");
    content.classList.add("hidden");
  }
};

function getUpcomingMovies() {
  const path = "/movie/upcoming";
  const url = generateUrl(path);
  const render = renderMovies.bind({ title: "Upcoming Movies" });
  requestMovie(url, render, handleError);
}

function getTopRatedMovies() {
  const path = "/movie/top_rated";
  const url = generateUrl(path);
  const render = renderMovies.bind({ title: "Top Rated Movies" });
  requestMovie(url, render, handleError);
}

function getPopularMovies() {
  const path = "/movie/popular";
  const url = generateUrl(path);
  const render = renderMovies.bind({ title: "Popular Movies" });
  requestMovie(url, render, handleError);
}

//for movie card
async function getMovieInformation(movieID) {
  const url = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    // Create your custom data structure
    const movieInfo = {
      id: movieID,
      title: data.title,
      overview: data.overview,
      poster_path: data.poster_path,
      vote_average: data.vote_average,
      vote_count: data.vote_count,
      notes: "",
    };

    // Return the new data structure
    return movieInfo;
  } catch (error) {
    console.error("Error fetching movie data:", error);
    // Return null or handle error as needed
    return null;
  }
}

// give back movie card div
function createMovieCard(movieData) {
  if (!movieData) return null; // Handle null data

  // Create main card container
  const card = document.createElement("div");
  // Style the card
  card.className =
    "flex items-start border border-gray-300 rounded p-4 shadow hover:shadow-lg transition-shadow max-w-2xl mb-4 bg-white";

  // Create poster image element
  const img = document.createElement("img");
  img.src = `https://image.tmdb.org/t/p/w200${movieData.poster_path}`;
  img.alt = `${movieData.title} poster`;
  img.className = "w-40 rounded object-cover mr-4";

  // Create container for text details
  const infoContainer = document.createElement("div");
  infoContainer.className = "flex flex-col";

  // Movie title
  const title = document.createElement("h3");
  title.textContent = movieData.title;
  title.className = "text-xl font-semibold mb-2 text-gray-800";

  // Overview
  const overview = document.createElement("p");
  overview.textContent = movieData.overview;
  overview.className = "mb-2 text-gray-700";

  // Vote info
  const voteInfo = document.createElement("p");
  voteInfo.textContent = `Rating: ${movieData.vote_average} (${movieData.vote_count} votes)`;
  voteInfo.className = "text-sm text-gray-600 mb-2";

  // Add "Add to Favorite" button
  const favButton = document.createElement("button");
  favButton.textContent = "Add to Favorite";
  favButton.className =
    "mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none";

  // Attach click event to store movie id
  favButton.onclick = () => {
    // Retrieve existing favorite movies array from localStorage
    let favoriteMovies =
      JSON.parse(localStorage.getItem("favoriteMovies")) || [];

    // Check if the movie is already in favorites by ID
    const isAlreadyFavorite = favoriteMovies.some((m) => m.id === movieData.id);

    const exists = favoriteMovies.some((m) => m.id === movieData.id);
    if (!exists) {
      favoriteMovies.push(movieData);
      localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
      favButton.textContent = "Added!";
      favButton.disabled = true;
    } else {
      alert("Already in favorites!");
    }
  };

  // Append text elements to info container
  infoContainer.appendChild(title);
  infoContainer.appendChild(overview);
  infoContainer.appendChild(voteInfo);
  infoContainer.appendChild(favButton); // append button

  // Append image and info container to main card
  card.appendChild(img);
  card.appendChild(infoContainer);

  // Return the complete card element
  return card;
}

searchMovie("Star Wars");

getPopularMovies();

getUpcomingMovies();

getTopRatedMovies();
