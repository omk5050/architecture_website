const API = "https://architecture-website-sjh4.onrender.com/api";

const token = localStorage.getItem("token");

// Redirect if not logged in
if (!token) {
  window.location.href = "login.html";
}

// LOAD BLOGS
async function loadBlogs() {
  try {
    const res = await fetch(`${API}/blogs`);
    const data = await res.json();

    const container = document.getElementById("blogContainer");
    container.innerHTML = "";

    data.data.forEach(blog => {
      const div = document.createElement("div");

      div.innerHTML = `
        <div style="border:1px solid #ccc; padding:10px; margin-bottom:10px;">
          <h3>${blog.title}</h3>
          <p>${blog.content}</p>
          ${blog.image ? `<img src="${blog.image}" width="200"/>` : ""}
          
          <button onclick="deleteBlog('${blog._id}')">Delete</button>
        </div>
      `;

      container.appendChild(div);
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
  await fetch(`${API}/blogs/${id}`, {
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