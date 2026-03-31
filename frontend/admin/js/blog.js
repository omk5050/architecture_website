const API = "https://architecture-website-sjh4.onrender.com/api/blogs";

const token = localStorage.getItem("token");

// Redirect if not logged in
if (!token) {
  window.location.href = "login.html";
}

// LOAD BLOGS
async function loadBlogs() {
  const res = await fetch(API);
  const data = await res.json();

  const container = document.getElementById("blogList");
  container.innerHTML = "";

  data.data.forEach(blog => {
    container.innerHTML += `
      <div class="blog-item">
        <h4>${blog.title}</h4>
        <p>${blog.content}</p>
        <button onclick="deleteBlog('${blog._id}')">Delete</button>
      </div>
    `;
  });
}

// CREATE BLOG
document.getElementById("blogForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", document.getElementById("title").value);
  formData.append("content", document.getElementById("content").value);

  const file = document.getElementById("image").files[0];
  if (file) formData.append("image", file);

  await fetch(API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  loadBlogs();
});

// DELETE BLOG
async function deleteBlog(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  loadBlogs();
}

// LOGOUT
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

loadBlogs();