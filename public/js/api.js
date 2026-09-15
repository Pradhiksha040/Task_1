/**
 * Task 5 REST API CRUD Client Interactions & Task 6 Auth Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  const usersTableBody = document.getElementById('usersTableBody');
  const refreshUsersBtn = document.getElementById('refreshUsersBtn');
  const toggleStoreViewBtn = document.getElementById('toggleStoreViewBtn');
  const storeModeLabel = document.getElementById('storeModeLabel');
  const statSubmissions = document.getElementById('statSubmissions');
  const cacheStatusText = document.getElementById('cacheStatusText');
  const cacheHitBadge = document.getElementById('cacheHitBadge');

  const editUserModal = document.getElementById('editUserModal') ? new bootstrap.Modal(document.getElementById('editUserModal')) : null;
  const editUserForm = document.getElementById('editUserForm');

  const loginForm = document.getElementById('loginForm');
  const loginAlert = document.getElementById('loginAlert');
  const authNavButtons = document.getElementById('authNavButtons');

  let currentMode = 'rest'; // 'rest' or 'temp'
  let authToken = localStorage.getItem('cognifyz_token') || '';

  // Update Auth Button State in Navbar
  function updateAuthUI() {
    if (!authNavButtons) return;
    const userJson = localStorage.getItem('cognifyz_user');
    const user = userJson ? JSON.parse(userJson) : null;

    if (authToken && user) {
      authNavButtons.innerHTML = `
        <span class="text-light small fw-semibold me-2"><i class="bi bi-person-circle text-primary me-1"></i> ${user.fullName}</span>
        <button class="btn btn-outline-danger btn-sm rounded-pill px-3" id="logoutBtn">
          <i class="bi bi-box-arrow-right me-1"></i> Logout
        </button>
      `;
      document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
    } else {
      authNavButtons.innerHTML = `
        <button class="btn btn-outline-light btn-sm rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#loginModal">
          <i class="bi bi-box-arrow-in-right me-1"></i> Login
        </button>
        <a href="/register" class="btn btn-primary btn-sm rounded-pill px-3 nav-link-custom" data-link="/register">
          <i class="bi bi-person-add me-1"></i> Get Started
        </a>
      `;
    }
  }

  // Handle Logout
  function handleLogout() {
    localStorage.removeItem('cognifyz_token');
    localStorage.removeItem('cognifyz_user');
    authToken = '';
    updateAuthUI();
    fetchUsersList();
  }

  // Handle Login Submit (Task 6 Auth)
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const result = await response.json();

        if (response.ok && result.success) {
          authToken = result.token;
          localStorage.setItem('cognifyz_token', result.token);
          localStorage.setItem('cognifyz_user', JSON.stringify(result.user));

          const loginModalEl = document.getElementById('loginModal');
          const modalInstance = bootstrap.Modal.getInstance(loginModalEl);
          if (modalInstance) modalInstance.hide();

          loginForm.reset();
          if (loginAlert) loginAlert.style.display = 'none';

          updateAuthUI();
          fetchUsersList();
        } else {
          if (loginAlert) {
            loginAlert.textContent = result.message || 'Login failed. Invalid credentials.';
            loginAlert.style.display = 'block';
          }
        }
      } catch (err) {
        console.error('Login Error:', err);
        if (loginAlert) {
          loginAlert.textContent = 'Network error authenticating user.';
          loginAlert.style.display = 'block';
        }
      }
    });
  }

  // Fetch Users List (Task 2 Temp or Task 5 REST API)
  async function fetchUsersList() {
    if (!usersTableBody) return;

    usersTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted py-4">
          <span class="spinner-border spinner-border-sm text-primary me-2"></span> Loading data...
        </td>
      </tr>
    `;

    try {
      const endpoint = currentMode === 'temp' ? '/api/temp-submissions' : '/api/users';
      const headers = { 'Accept': 'application/json' };
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

      const response = await fetch(endpoint, { headers });
      const result = await response.json();

      if (response.ok && result.success) {
        const users = result.data || [];
        if (statSubmissions) statSubmissions.textContent = users.length;

        // Update Cache status (Task 8)
        if (cacheStatusText) {
          cacheStatusText.textContent = result.cached 
            ? `Cache Engine: Hit (Served from ${result.cacheType || 'Redis/Memory'})` 
            : `Cache Engine: Miss (Direct Database Query)`;
        }
        if (cacheHitBadge) {
          cacheHitBadge.className = result.cached ? 'badge bg-success' : 'badge bg-secondary';
          cacheHitBadge.textContent = result.cached ? 'CACHE HIT' : 'DB QUERY';
        }

        if (users.length === 0) {
          usersTableBody.innerHTML = `
            <tr>
              <td colspan="7" class="text-center text-muted py-4">
                <i class="bi bi-inbox fs-3 d-block mb-2"></i> No records found. Register a user above!
              </td>
            </tr>
          </table>`;
          return;
        }

        usersTableBody.innerHTML = users.map((user, idx) => `
          <tr>
            <td class="fw-bold text-muted">${idx + 1}</td>
            <td>
              <div class="fw-bold text-white">${user.fullName}</div>
              <small class="text-muted">${user.role || 'User'}</small>
            </td>
            <td>${user.email}</td>
            <td>${user.phone || '--'}</td>
            <td><span class="badge bg-dark border border-secondary">${user.city || 'N/A'}</span></td>
            <td>${user.dob ? new Date(user.dob).toLocaleDateString() : '--'}</td>
            <td>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-info btn-edit-user" data-id="${user._id || user.id}">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-outline-danger btn-delete-user" data-id="${user._id || user.id}">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `).join('');

        // Attach action handlers
        document.querySelectorAll('.btn-edit-user').forEach(btn => {
          btn.addEventListener('click', () => handleEditUser(btn.getAttribute('data-id'), users));
        });
        document.querySelectorAll('.btn-delete-user').forEach(btn => {
          btn.addEventListener('click', () => handleDeleteUser(btn.getAttribute('data-id')));
        });
      } else {
        usersTableBody.innerHTML = `
          <tr>
            <td colspan="7" class="text-center text-danger py-4">
              <i class="bi bi-exclamation-octagon me-2"></i> Failed to fetch records: ${result.message || 'Server error'}
            </td>
          </tr>
        `;
      }
    } catch (err) {
      console.error('Fetch Users Error:', err);
      usersTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-danger py-4">
            <i class="bi bi-wifi-off me-2"></i> Network error connecting to API.
          </td>
        </tr>
      `;
    }
  }

  // Edit User Handler (Task 5 PUT)
  function handleEditUser(id, users) {
    const user = users.find(u => (u._id || u.id).toString() === id.toString());
    if (!user) return;

    document.getElementById('editUserId').value = id;
    document.getElementById('editFullName').value = user.fullName;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editPhone').value = user.phone || '';
    document.getElementById('editCity').value = user.city || '';

    if (editUserModal) editUserModal.show();
  }

  if (editUserForm) {
    editUserForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('editUserId').value;
      const payload = {
        fullName: document.getElementById('editFullName').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editPhone').value,
        city: document.getElementById('editCity').value
      };

      try {
        const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        };
        if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

        const response = await fetch(`/api/users/${id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (response.ok && result.success) {
          if (editUserModal) editUserModal.hide();
          fetchUsersList();
        } else {
          alert(`Failed to update user: ${result.message}`);
        }
      } catch (err) {
        console.error('Update User Error:', err);
        alert('Network error updating user.');
      }
    });
  }

  // Delete User Handler (Task 5 DELETE)
  async function handleDeleteUser(id) {
    if (!confirm('Are you sure you want to delete this user record?')) return;

    try {
      const headers = { 'Accept': 'application/json' };
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers
      });

      const result = await response.json();
      if (response.ok && result.success) {
        fetchUsersList();
      } else {
        alert(`Failed to delete user: ${result.message}`);
      }
    } catch (err) {
      console.error('Delete User Error:', err);
      alert('Network error deleting user.');
    }
  }

  // Toggle Store View Button
  if (toggleStoreViewBtn) {
    toggleStoreViewBtn.addEventListener('click', () => {
      currentMode = currentMode === 'rest' ? 'temp' : 'rest';
      storeModeLabel.textContent = currentMode === 'rest' ? 'REST Users API' : 'Task 2 Temp Store';
      fetchUsersList();
    });
  }

  if (refreshUsersBtn) {
    refreshUsersBtn.addEventListener('click', fetchUsersList);
  }

  // Expose fetch function globally for validation.js
  window.fetchUsersList = fetchUsersList;

  // Initialize Auth & Users List
  updateAuthUI();
  fetchUsersList();
});
