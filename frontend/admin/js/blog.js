const API = "https://architecture-website-sjh4.onrender.com/api/blogs";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

let blogs = [];
let editId = null;
let query = '';

async function loadBlogs() {
  try {
    const res = await fetch(API, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.data) {
      blogs = data.data.map(b => ({
        id: b._id,
        title: b.title,
        content: b.content,
        // The deployed API might not have category/status natively without backend update
        category: b.category || "Architecture", 
        status: b.status || "published",
        date: new Date(b.createdAt || Date.now()).toLocaleDateString('en-US',{month:'short',day:'numeric'}),
        image: b.image
      }));
      render();
    }
  } catch (err) {
    console.error("LOAD BLOG ERROR:", err);
  }
}

function render() {
  const filtered = blogs.filter(b => b.title.toLowerCase().includes(query) || b.category.toLowerCase().includes(query));
  document.getElementById('countLabel').textContent = blogs.length + ' post' + (blogs.length !== 1 ? 's' : '');
  const tb = document.getElementById('tbody');
  
  if (!filtered.length) {
    tb.innerHTML = `<tr><td colspan="5" class="empty">No posts found</td></tr>`;
    return;
  }
  
  tb.innerHTML = filtered.map(b => `
    <tr>
      <td class="title-cell" data-label="Title" title="${b.title}">${b.title}</td>
      <td data-label="Category">${b.category}</td>
      <td data-label="Status"><span class="badge badge-${b.status}">${b.status}</span></td>
      <td data-label="Date">${b.date}</td>
      <td data-label="Actions">
        <div class="action-btns">
          <button class="btn btn-outline btn-sm" onclick="editPost('${b.id}')">Edit</button>
          <button class="btn btn-red btn-sm" onclick="deletePost('${b.id}')">Delete</button>
        </div>
      </td>
    </tr>`).join('');
}

function search(q) {
  query = q.toLowerCase();
  render();
}

async function submitPost() {
  const titleInput = document.getElementById('fTitle');
  const title = titleInput.value.trim();
  
  if (!title) return titleInput.focus();

  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", document.getElementById('fContent').value);
  formData.append("category", document.getElementById('fCategory').value);
  formData.append("status", document.getElementById('fStatus').value);

  const file = document.getElementById('fImage').files[0];
  if (file) formData.append("image", file);

  const isEdit = !!editId;
  const url = isEdit ? `${API}/${editId}` : API;
  const method = isEdit ? "PUT" : "POST";

  const btn = document.getElementById('submitBtn');
  const orgText = btn.textContent;
  btn.textContent = 'Saving...';
  btn.disabled = true;

  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();
    if (!res.ok) {
      await showAlert("Error", data.message || "Failed to save blog post");
    } else {
      cancelEdit();
      await loadBlogs();
    }
  } catch (err) {
    console.error("SAVE BLOG ERROR:", err);
    await showAlert("Error", "Error saving blog post");
  } finally {
    btn.textContent = orgText;
    btn.disabled = false;
  }
}

function editPost(id) {
  const b = blogs.find(x => x.id === id);
  if (!b) return;
  
  editId = id;
  document.getElementById('fTitle').value = b.title;
  document.getElementById('fContent').value = b.content;
  document.getElementById('fCategory').value = b.category;
  document.getElementById('fStatus').value = b.status;
  document.getElementById('fImage').value = ''; 
  
  document.getElementById('formTitle').textContent = 'Edit post';
  document.getElementById('submitBtn').textContent = 'Save changes';
  document.getElementById('cancelBtn').style.display = '';
  document.getElementById('fTitle').focus();
  window.scrollTo({top: 0, behavior: 'smooth'});
}

function cancelEdit() {
  editId = null;
  document.getElementById('fTitle').value = '';
  document.getElementById('fContent').value = '';
  document.getElementById('fCategory').value = 'Architecture';
  document.getElementById('fStatus').value = 'draft';
  document.getElementById('fImage').value = '';
  
  document.getElementById('formTitle').textContent = 'Create blog post';
  document.getElementById('submitBtn').textContent = 'Create post';
  document.getElementById('cancelBtn').style.display = 'none';
}

async function deletePost(id) {
  const confirmed = await showConfirm('Delete Post', 'Are you sure you want to delete this post? This action cannot be undone.');
  if (!confirmed) return;

  try {
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const data = await res.json();
      await showAlert("Error", data.message || "Failed to delete blog");
      return;
    }

    await loadBlogs();
  } catch (err) {
    console.error("DELETE BLOG ERROR:", err);
  }
}

// CUSTOM MODAL UTILS
function showConfirm(title, text) {
  return new Promise((resolve) => {
    const overlay = document.getElementById('customModalOverlay');
    if (!overlay) return resolve(confirm(text));
    
    document.getElementById('customModalTitle').textContent = title;
    document.getElementById('customModalText').textContent = text;
    
    const cancelBtn = document.getElementById('customModalCancel');
    const confirmBtn = document.getElementById('customModalConfirm');
    
    cancelBtn.style.display = 'inline-flex';
    confirmBtn.textContent = 'Confirm';
    
    cancelBtn.onclick = () => { overlay.classList.remove('active'); resolve(false); };
    confirmBtn.onclick = () => { overlay.classList.remove('active'); resolve(true); };
    
    overlay.classList.add('active');
  });
}

function showAlert(title, text) {
  return new Promise((resolve) => {
    const overlay = document.getElementById('customModalOverlay');
    if (!overlay) {
      alert(text);
      return resolve();
    }
    
    document.getElementById('customModalTitle').textContent = title;
    document.getElementById('customModalText').textContent = text;
    
    const cancelBtn = document.getElementById('customModalCancel');
    const confirmBtn = document.getElementById('customModalConfirm');
    
    cancelBtn.style.display = 'none';
    confirmBtn.textContent = 'OK';
    
    confirmBtn.onclick = () => { overlay.classList.remove('active'); resolve(); };
    
    overlay.classList.add('active');
  });
}

// INIT
loadBlogs();