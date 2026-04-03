const API = "https://architecture-website-sjh4.onrender.com/api/blogs";

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

// LOAD BLOGS
async function loadBlogs() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    console.log("BLOG DATA:", data);

    const container = document.getElementById("blogContainer");
    container.innerHTML = "";

    data.data.forEach(blog => {
      container.innerHTML += `
        <div class="blog-item">
          <h4>${blog.title}</h4>
          <p>${blog.content}</p>
          ${blog.image ? `<img src="${blog.image}" width="200"/>` : ""}
          <button onclick="deleteBlog('${blog._id}')">Delete</button>
        </div>
      `;
    });

  } catch (err) {
    console.error("LOAD BLOG ERROR:", err);
  }
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

// INIT
loadBlogs();