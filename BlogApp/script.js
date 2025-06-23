// script.js

// Navigation
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const page = link.getAttribute('data-page');
    navigateTo(page);
  });
});

function navigateTo(pageId) {
  pages.forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

// Scroll to Top
const scrollBtn = document.getElementById('scrollTop');
window.onscroll = function () {
  scrollBtn.style.display = window.scrollY > 100 ? 'block' : 'none';
};
scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// Rotating Quote
const quotes = [
  "Where thoughts become words.",
  "Scribble your soul.",
  "Every story starts with a scribble."
];
let quoteIndex = 0;
setInterval(() => {
  document.getElementById('rotatingQuote').textContent = quotes[quoteIndex];
  quoteIndex = (quoteIndex + 1) % quotes.length;
}, 4000);

// Modals
function openModal(id) {
  document.getElementById(id).style.display = 'flex';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

document.getElementById('loginBtn').onclick = () => openModal('loginModal');
document.getElementById('signupBtn').onclick = () => openModal('signupModal');
document.getElementById('homeLoginBtn').onclick = () => openModal('loginModal');
document.getElementById('homeSignupBtn').onclick = () => openModal('signupModal');


// Authentication
function handleSignup() {
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;
  const users = JSON.parse(localStorage.getItem('users')) || [];
  if (users.some(u => u.username === username)) {
    alert('User already exists');
    return;
  }
  users.push({ username, password });
  localStorage.setItem('users', JSON.stringify(users));
  alert('Signup successful!');
  closeModal('signupModal');
}

function handleLogin() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const match = users.find(u => u.username === username && u.password === password);
  if (match) {
    localStorage.setItem('currentUser', JSON.stringify(username));
    updateAuthUI();
    closeModal('loginModal');
  } else {
    alert('Invalid credentials');
  }
}

document.getElementById('logoutBtn').onclick = () => {
  localStorage.removeItem('currentUser');
  updateAuthUI();
};

function updateAuthUI() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const addBtn = document.getElementById('addPostBtn');

  document.getElementById('loginBtn').style.display = currentUser ? 'none' : 'inline-block';
  document.getElementById('signupBtn').style.display = currentUser ? 'none' : 'inline-block';
  document.getElementById('logoutBtn').style.display = currentUser ? 'inline-block' : 'none';
  addBtn.style.display = currentUser ? 'block' : 'none';
}

updateAuthUI();

// Blog Logic
function renderPosts() {
  const list = document.getElementById('postList');
  list.innerHTML = '';
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  posts.forEach(post => {
    const div = document.createElement('div');
    div.className = 'post-card';

    const deleteBtn = currentUser
      ? `<span class="delete-btn" onclick="deletePost(${post.id}, event)">🗑️</span>`
      : '';

    const imageHTML = post.image
      ? `<img src="${post.image}" alt="Post Image" class="post-image">`
      : '';

    div.innerHTML = `
      <div class="post-header">
        <h3>${post.title}</h3>
        ${deleteBtn}
      </div>
      <small>${post.date} — ${post.tag}</small>
      ${imageHTML}
      <p>${post.content.slice(0, 100)}...</p>
    `;

    div.onclick = () => viewPost(post.id);
    list.appendChild(div);
  });
}

function viewPost(id) {
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  const post = posts.find(p => p.id === id);
  if (!post) return;

  const content = `
    <h2>${post.title}</h2>
    <small>${post.date} — ${post.tag}</small>
    ${post.image ? `<img src="${post.image}" class="post-image">` : ''}
    <p>${post.content}</p>
  `;

  document.getElementById('singlePostContent').innerHTML = content;
  navigateTo('postView');
}

function deletePost(id, event) {
  event.stopPropagation();
  if (!confirm("Are you sure you want to delete this post?")) return;
  let posts = JSON.parse(localStorage.getItem('posts')) || [];
  posts = posts.filter(p => p.id !== id);
  localStorage.setItem('posts', JSON.stringify(posts));
  renderPosts();
}

// Add Post
function submitNewPost() {
  const title = document.getElementById('newPostTitle').value.trim();
  const tag = document.getElementById('newPostTag').value.trim();
  const content = document.getElementById('newPostContent').value.trim();
  const imageFile = document.getElementById('newPostImage').files[0];

  if (!title || !tag || !content) {
    alert("Please fill all fields");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = function () {
    const imageBase64 = imageFile ? reader.result : null;
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const id = Date.now();

    posts.unshift({
      id,
      title,
      tag,
      content,
      image: imageBase64,
      date: new Date().toLocaleDateString()
    });

    localStorage.setItem('posts', JSON.stringify(posts));
    clearNewPostForm();
    navigateTo('blog');
    renderPosts();
  };

  if (imageFile) {
    reader.readAsDataURL(imageFile);
  } else {
    reader.onloadend();
  }
}

function clearNewPostForm() {
  document.getElementById('newPostTitle').value = '';
  document.getElementById('newPostTag').value = '';
  document.getElementById('newPostContent').value = '';
  document.getElementById('newPostImage').value = '';
}

document.getElementById('addPostBtn').addEventListener('click', () => {
  navigateTo('addPostPage');
});

renderPosts();


