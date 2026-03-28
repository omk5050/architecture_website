const form = document.getElementById("blogForm");

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const imageInput = document.getElementById("image");

// ⚠️ TEMP TOKEN (replace after login system)
const token = localStorage.getItem("adminToken");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append("title", titleInput.value);
  formData.append("content", contentInput.value);
  formData.append("image", imageInput.files[0]);

  try {
    const res = await fetch("https://architecture-website-sjh4.onrender.com/api/blogs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();

    console.log(data);

    if (res.ok) {
      alert("Blog created successfully");
      form.reset();
    } else {
      alert(data.message || "Error creating blog");
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
});