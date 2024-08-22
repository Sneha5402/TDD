function setupUserManagement() {
    const userBtn = document.querySelector('#user-btn');
    const userModal = document.querySelector('#user-modal');
    const closeBtn = document.querySelector('#close-btn');
    const saveBtn = document.querySelector('#save-btn');
    const updateBtn = document.querySelector('#update-btn');
    const userForm = document.querySelector('#user-form');
    const messageDiv = document.querySelector('#message');

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let editIndex = null;

    userBtn.addEventListener('click', () => {
        const details = document.querySelector('#details');
        details.innerHTML = `
            <h2>Add User</h2>
            <button class="user-btn" id="add-user-btn">Add User</button>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="user-table-body"></tbody>
            </table>
        `;

        document.querySelector('#add-user-btn').addEventListener('click', () => {
            userForm.reset();
            saveBtn.style.display = 'block';
            updateBtn.style.display = 'none';
            userModal.style.display = 'block';
        });

        renderUsers();
    });
    closeBtn.addEventListener('click', () => {
        userModal.style.display = 'none';
    });

    userForm.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (saveBtn.style.display !== 'none') {
                saveBtn.click(); // Trigger Save if it's visible
            } else if (updateBtn.style.display !== 'none') {
                updateBtn.click(); // Trigger Update if it's visible
            }
        }
    });

    function renderUsers() {
        const userTableBody = document.getElementById('user-table-body');
        userTableBody.innerHTML = '';

        users.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>
                    <button class="action-edit" onclick="editUser(${index})">Update</button>
                    <button class="action-delete" onclick="deleteUser(${index})">Delete</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    }

    function validateForm() {
        const fields = [userForm.username, userForm.email, userForm.firstName, userForm.lastName];
        for (const field of fields) {
            if (field.value.trim() === '') {
                messageDiv.textContent = `${field.name} is required and cannot be empty or contain only spaces.`;
                setTimeout(() => {
                    messageDiv.textContent = ''; 
                }, 3000);
                return false;
            }
            if (field.value[0] === ' ') {
                messageDiv.textContent = `${field.name} should not start with a space.`;
                setTimeout(() => {
                    messageDiv.textContent = ''; 
                }, 3000);
                return false;
            }
        }
        return true;
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            document.body.removeChild(toast);
        }, 3000);
    }

    function saveUsersToLocalStorage() {
        localStorage.setItem('users', JSON.stringify(users));
    }

    saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const newUser = {
            username: userForm.username.value,
            email: userForm.email.value,
            firstName: userForm.firstName.value,
            lastName: userForm.lastName.value,
        };
        users.push(newUser);
        saveUsersToLocalStorage();
        userModal.style.display = 'none';
        renderUsers();
        showToast('User added successfully!');
    });

    updateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        if (editIndex !== null) {
            users[editIndex] = {
                username: userForm.username.value,
                email: userForm.email.value,
                firstName: userForm.firstName.value,
                lastName: userForm.lastName.value,
            };
            saveUsersToLocalStorage();
            userModal.style.display = 'none';
            renderUsers();
            showToast('User updated successfully!');
        }
    });

    window.editUser = function (index) {
        editIndex = index;

        userForm.username.value = users[index].username;
        userForm.email.value = users[index].email;
        userForm.firstName.value = users[index].firstName;
        userForm.lastName.value = users[index].lastName;

        saveBtn.style.display = 'none';
        updateBtn.style.display = 'block';
        userModal.style.display = 'block';
    };

    window.deleteUser = function (index) {
        if (confirm('Are you sure you want to delete this user?')) {
            users.splice(index, 1);
            saveUsersToLocalStorage();
            renderUsers();
            showToast('User deleted successfully!');
        }
    };
}

function setupGroupManagement() {
    const groupBtn = document.querySelector('#group-btn');
    let groups = JSON.parse(localStorage.getItem('groups')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];

    groupBtn.addEventListener('click', () => {
        const details = document.querySelector('#details');
        details.innerHTML = `
            <h2>Group Management</h2>
            <button id="create-group-btn">Create Group</button>
            <table>
                <thead>
                    <tr>
                        <th>Group Name</th>
                        <th>User Names</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="group-table-body"></tbody>
            </table>
        `;

        // Render groups on load
        renderGroups();

        // Event listener for "Create Group" button
        document.querySelector('#create-group-btn').addEventListener('click', () => {
            openCreateGroupModal();
        });
    });

    // Function to open the "Create Group" modal
    function openCreateGroupModal() {
        const modal = document.createElement('div');
        modal.id = 'create-group-modal';
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
                <span id="close-group-btn" class="close-btn">&times;</span>
                <h2>Create Group</h2>
                <form id="create-group-form">
                    <label for="group-name">Group Name:</label>
                    <input type="text" id="group-name" name="group-name">
                    <button id="save-group-btn" type="button">Save</button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Display the modal
        modal.style.display = 'block';

        // Close modal when close button is clicked
        document.querySelector('#close-group-btn').addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.removeChild(modal);
        });
        // Save group when clicking the save button
        document.querySelector('#save-group-btn').addEventListener('click', () => {
            const groupName = document.querySelector('#group-name').value.trim();

      

            groups.push({ name: groupName, users: [] });
            localStorage.setItem('groups', JSON.stringify(groups));

            // Close modal and re-render groups
            modal.style.display = 'none';
            document.body.removeChild(modal);
            renderGroups();
        });
        
    }




    function renderGroups() {
        const groupTableBody = document.getElementById('group-table-body');
        groupTableBody.innerHTML = '';

        groups.forEach((group, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${group.name}</td>
                <td>${group.users.join(', ') || 'No users assigned'}</td>
                <td>
                    <button class="action-assign" onclick="assignGroup(${index})">Assign</button>
                    <button class="action-remove-user" onclick="removeUser(${index})">Remove User</button>
                    <button class="action-delete" onclick="deleteGroup(${index})">Delete</button>
                </td>
            `;
            groupTableBody.appendChild(row);
        });
        setupGroupManagement();
    }


    window.assignGroup = function (index) {
        let groups = JSON.parse(localStorage.getItem('groups')) || [];
        const group = groups[index];
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Assign Users to Group</h2>
                <form id="assign-form">
                    <label for="user-select">Select Users:</label>
                    <select id="user-select" multiple>
                        ${users.map(user => `<option value="${user.username}">${user.username}</option>`).join('')}
                    </select>
                    <div id="assign-message" class="message"></div>
                    <button id="save-assign-btn" type="button">Save</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'block'; // Ensure the modal is visible

        document.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        document.getElementById('save-assign-btn').addEventListener('click', () => {
            const selectedOptions = Array.from(document.getElementById('user-select').selectedOptions);
            const selectedUsernames = selectedOptions.map(option => option.value);

            // Update group users and local storage
            group.users = selectedUsernames;
            localStorage.setItem('groups', JSON.stringify(groups));
            
            // Close modal and update UI
            document.body.removeChild(modal);
            renderGroups();
            showToast('Users assigned successfully!');
        });
    };

    window.removeUser = function (groupIndex) {
        let groups = JSON.parse(localStorage.getItem('groups')) || [];
        const group = groups[groupIndex];
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Remove Users from Group</h2>
                <form id="remove-form">
                    <label for="remove-select">Select Users to Remove:</label>
                    <select id="remove-select" multiple>
                        ${group.users.map(user => `<option value="${user}">${user}</option>`).join('')}
                    </select>
                    <div id="remove-message" class="message"></div>
                    <button id="delete-remove-btn" type="button">Remove</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'block'; // Ensure the modal is visible

        document.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.getElementById('delete-remove-btn').addEventListener('click', () => {
            const selectedOptions = Array.from(document.getElementById('remove-select').selectedOptions);
            const selectedUsernames = selectedOptions.map(option => option.value);

            // Remove selected users and update local storage
            group.users = group.users.filter(user => !selectedUsernames.includes(user));
            localStorage.setItem('groups', JSON.stringify(groups));
            
            // Close modal and update UI
            document.body.removeChild(modal);
            renderGroups();
            showToast('Users removed successfully!');
        });
    };


    window.deleteGroup = function (index) {
        if (confirm('Are you sure you want to delete this group?')) {
            groups.splice(index, 1);
            localStorage.setItem('groups', JSON.stringify(groups));
            renderGroups();
            showToast('Group deleted successfully!');
        }
    };
}

function setupRoleManagement() {
    const roleBtn = document.querySelector('#role-btn');
    let roles = JSON.parse(localStorage.getItem('roles')) || [];

    roleBtn.addEventListener('click', () => {
        const details = document.querySelector('#details');
        details.innerHTML = `
            <h2>Role Management</h2>
            <button id="add-role-btn">Add Role</button>
            <table>
                <thead>
                    <tr>
                        <th>Role Name</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="role-table-body"></tbody>
            </table>
        `;

        renderRoles();

        document.querySelector('#add-role-btn').addEventListener('click', () => {
            openCreateRoleModal();
        });
    });

    function openCreateRoleModal() {
        const modal = document.createElement('div');
        modal.id = 'create-role-modal';
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
                <span id="close-role-btn" class="close-btn">&times;</span>
                <h2>Add Role</h2>
                <form id="create-role-form">
                    <label for="role-name">Role Name:</label>
                    <input type="text" id="role-name" name="role-name" required>
                    <label for="role-description">Description:</label>
                    <textarea id="role-description" name="role-description" rows="4" required></textarea>
                    <button id="save-role-btn" type="button">Save</button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';

        const closeBtn = document.querySelector('#close-role-btn');
        const saveBtn = document.querySelector('#save-role-btn');
        const createRoleForm = document.querySelector('#create-role-form');

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.removeChild(modal);
        });

        saveBtn.addEventListener('click', saveRole);

        createRoleForm.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent the default form submission
                saveRole();
            }
        });

        function saveRole() {
            const roleName = document.querySelector('#role-name').value.trim();
            const roleDescription = document.querySelector('#role-description').value.trim();

            if (roleName === '' || roleDescription === '') {
                showToast('Role name and description cannot be empty.');
                return;
            }

            roles.push({ name: roleName, description: roleDescription });
            localStorage.setItem('roles', JSON.stringify(roles));

            modal.style.display = 'none';
            document.body.removeChild(modal);
            renderRoles();
            showToast('Role added successfully!');
        }
    }

    function renderRoles() {
        const roleTableBody = document.getElementById('role-table-body');
        roleTableBody.innerHTML = '';

        roles.forEach((role, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${role.name}</td>
                <td>${role.description}</td>
                <td>
                    <button class="action-delete" onclick="deleteRole(${index})">Delete</button>
                </td>
            `;
            roleTableBody.appendChild(row);
        });
    }

    window.deleteRole = function (index) {
        if (confirm('Are you sure you want to delete this role?')) {
            roles.splice(index, 1);
            localStorage.setItem('roles', JSON.stringify(roles));
            renderRoles();
            showToast('Role deleted successfully!');
        }
    };
}

function setupEventListeners() {
    setupUserManagement();
    setupGroupManagement();
    setupRoleManagement();
}

// Call setupEventListeners to initialize everything
setupEventListeners();




module.exports = {
    
    setupEventListeners,

};





