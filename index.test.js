const fs = require('fs');
const path = require('path');

describe('User Management HTML', () => {

  beforeAll(() => {
    const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
    document.documentElement.innerHTML = html;
    container = document.body;
  });

  // Title 
  test('should have a title "Management"', () => {
    const title = document.querySelector('title');
    expect(title.textContent).toBe('Management');
  });

  // Header 
  test('should have a header "User Management"', () => {
    const header = document.querySelector('header h2');
    expect(header).not.toBeNull();
    expect(header.textContent).toBe('User Management');
  });

  // Container 
  test('should have a container with class "content"', () => {
    const content = document.querySelector('.content');
    expect(content).toBeTruthy();

    // Index buttons
    const index = content.querySelector('.index');
    expect(index).not.toBeNull();

    const addUserButton = index.querySelector('#user-btn');
    expect(addUserButton).not.toBeNull();
    expect(addUserButton.querySelector('span').textContent).toBe('User Management');
    expect(addUserButton.querySelector('i').classList.contains('fas')).toBe(true);
    expect(addUserButton.querySelector('i').classList.contains('fa-user-plus')).toBe(true);

    const groupButton = index.querySelector('#group-btn');
    expect(groupButton).not.toBeNull();
    expect(groupButton.querySelector('span').textContent).toBe('Group Management');
    expect(groupButton.querySelector('i').classList.contains('fas')).toBe(true);
    expect(groupButton.querySelector('i').classList.contains('fa-users')).toBe(true);

    const roleButton = index.querySelector('#role-btn');
    expect(roleButton).not.toBeNull();
    expect(roleButton.querySelector('span').textContent).toBe('Role Management');
    expect(roleButton.querySelector('i').classList.contains('fas')).toBe(true);
    expect(roleButton.querySelector('i').classList.contains('fa-user-shield')).toBe(true);

    // Details container
    const details = content.querySelector('#details');
    expect(details).not.toBeNull();
    expect(details.children.length).toBe(3); // Initially empty

        // Check default content within the details section
        const header = details.querySelector('h1');
        expect(header).not.toBeNull();
        expect(header.textContent).toBe('Welcome to User Management');
    
        const image = details.querySelector('img');
        expect(image).not.toBeNull();
        const imageSrc = new URL(image.src).pathname;
        expect(imageSrc).toBe("/image/user.png");

  });

  test('should test the modal page',()=>{
    // User Modal
    const userModal = document.querySelector('#user-modal');
    expect(userModal).not.toBeNull();
    expect(userModal.style.display).toBe('none'); // Initially hidden

    const modalContent = userModal.querySelector('.modal-content');
    expect(modalContent).not.toBeNull();

    const closeButton = modalContent.querySelector('#close-btn');
    expect(closeButton).not.toBeNull();
    expect(closeButton.textContent).toBe('×');

    const modalTitle = modalContent.querySelector('#modal-title');
    expect(modalTitle).not.toBeNull();
    expect(modalTitle.textContent).toBe('Add User');

    // User form
    const userForm = modalContent.querySelector('#user-form');
    expect(userForm).not.toBeNull();

    const usernameLabel = userForm.querySelector('label[for="username"]');
    expect(usernameLabel).not.toBeNull();
    expect(usernameLabel.textContent).toBe('Username:');

    const usernameInput = userForm.querySelector('#username');
    expect(usernameInput).not.toBeNull();
    expect(usernameInput.getAttribute('name')).toBe('username');

    const emailLabel = userForm.querySelector('label[for="email"]');
    expect(emailLabel).not.toBeNull();
    expect(emailLabel.textContent).toBe('Email:');

    const emailInput = userForm.querySelector('#email');
    expect(emailInput).not.toBeNull();
    expect(emailInput.getAttribute('name')).toBe('email');

    const firstNameLabel = userForm.querySelector('label[for="firstName"]');
    expect(firstNameLabel).not.toBeNull();
    expect(firstNameLabel.textContent).toBe('First Name:');

    const firstNameInput = userForm.querySelector('#firstName');
    expect(firstNameInput).not.toBeNull();
    expect(firstNameInput.getAttribute('name')).toBe('firstName');

    const lastNameLabel = userForm.querySelector('label[for="lastName"]');
    expect(lastNameLabel).not.toBeNull();
    expect(lastNameLabel.textContent).toBe('Last Name:');

    const lastNameInput = userForm.querySelector('#lastName');
    expect(lastNameInput).not.toBeNull();
    expect(lastNameInput.getAttribute('name')).toBe('lastName');

    const messageDiv = document.querySelector('#message');
    expect(messageDiv).not.toBeNull();
    expect(messageDiv.classList.contains('message')).toBe(true);
    expect(messageDiv.textContent).toBe(''); // Initially empty

    const formButtons = userForm.querySelector('.form-buttons');
    expect(formButtons).not.toBeNull();

    const saveButton = formButtons.querySelector('#save-btn');
    expect(saveButton).not.toBeNull();
    expect(saveButton.textContent).toBe('Save');

    const updateButton = formButtons.querySelector('#update-btn');
    expect(updateButton).not.toBeNull();
    expect(updateButton.style.display).toBe('none');
    expect(updateButton.textContent).toBe('Update Changes');
  });
});









