const themeToggle = document.getElementById("themeToggle");
const html = document.getElementById("htmlElement");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const clearButton = document.getElementById("clearButton");

function updateThemeButton() {
  if (html.classList.contains("dark")) {
    document.getElementById("moonIcon").classList.remove("hidden");
    document.getElementById("sunIcon").classList.add("hidden");
  } else {
    document.getElementById("moonIcon").classList.add("hidden");
    document.getElementById("sunIcon").classList.remove("hidden");
  }
}

themeToggle.addEventListener("click", () => {
  html.classList.toggle("dark");
  localStorage.setItem("darkMode", html.classList.contains("dark") ? "true" : "false");
  updateThemeButton();
});

document.addEventListener("DOMContentLoaded", () => {
  let darkMode = localStorage.getItem("darkMode");

  if (darkMode === null) {
    localStorage.setItem("darkMode", "true");
    darkMode = "true";
  }

  if (darkMode === "true") {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }

  updateThemeButton();
});

function autoResize() {
  searchInput.style.height = "auto";
  const newHeight = Math.max(58, Math.min(searchInput.scrollHeight, 200));
  searchInput.style.height = newHeight + "px";
  clearButton.style.display = searchInput.value ? "flex" : "none";
}

searchInput.addEventListener("input", autoResize);

clearButton.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.style.height = "58px";
  clearButton.style.display = "none";
  searchInput.focus();
});

searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    searchForm.dispatchEvent(new Event("submit"));
  }
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    searchForm.reset();
    window.location.href = `https://unduck.link?q=${encodeURIComponent(query)}`;
  }
});
