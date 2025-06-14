const API_KEY = 'Ie_oPNRbIB1LMV5oX57ruqYhuSTjWW1nZ3LIaA2UmgA';
let images = [];
let currentIndex = 0;
let autoPlayInterval;

const carouselImage = document.getElementById('carouselImage');
const dotsContainer = document.getElementById('dotsContainer');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

document.getElementById('prevBtn').addEventListener('click', () => {
  showImage((currentIndex - 1 + images.length) % images.length);
});

document.getElementById('nextBtn').addEventListener('click', () => {
  showImage((currentIndex + 1) % images.length);
});

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    fetchImages(query);
  }
});

function fetchImages(query = 'nature') {
  fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=5&client_id=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      images = data.results.map(image => image.urls.regular);
      showImage(0);
      createDots();
      startAutoPlay();
    })
    .catch(err => {
      console.error('Error fetching images:', err);
    });
}

function showImage(index) {
  currentIndex = index;
  carouselImage.style.opacity = 0;
  setTimeout(() => {
    carouselImage.src = images[index];
    carouselImage.style.opacity = 1;
  }, 300);
  updateDots();
}

function createDots() {
  dotsContainer.innerHTML = '';
  images.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.addEventListener('click', () => {
      showImage(index);
      restartAutoPlay();
    });
    dotsContainer.appendChild(dot);
  });
  updateDots();
}

function updateDots() {
  const dots = document.querySelectorAll('.dots span');
  dots.forEach(dot => dot.classList.remove('active'));
  if (dots[currentIndex]) dots[currentIndex].classList.add('active');
}

function startAutoPlay() {
  clearInterval(autoPlayInterval);
  autoPlayInterval = setInterval(() => {
    showImage((currentIndex + 1) % images.length);
  }, 5000);
}

function restartAutoPlay() {
  startAutoPlay();
}
fetchImages(); // Load default 'nature' images on start
document.addEventListener('DOMContentLoaded', () => {
  fetchImages(); // Load default 'nature' images on start
});
// Ensure the carousel is initialized with default images
document.addEventListener('DOMContentLoaded', () => {
  fetchImages(); // Load default 'nature' images on start
});
document.addEventListener('keydown', (e) => {
  if(e.key === 'ArrowLeft') {
    showImage((currentIndex - 1 + images.length) % images.length);
    restartAutoPlay();
  }
  if(e.key === 'ArrowRight') {
    showImage((currentIndex + 1) % images.length);
    restartAutoPlay();
  }
});
