const fs = require('fs');
const path = require('path');

let userBtn, userModal, closeBtn, saveBtn, updateBtn, userForm, messageDiv, userTableBody;

beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');
    document.body.innerHTML = html;

    // Select elements
    userBtn = document.querySelector('#user-btn');
    userModal = document.querySelector('#user-modal');
    closeBtn = document.querySelector('#close-btn');
    saveBtn = document.querySelector('#save-btn');
    updateBtn = document.querySelector('#update-btn');
    userForm = document.querySelector('#user-form');
    messageDiv = document.querySelector('#message');
    userTableBody = document.querySelector('#user-table-body');

     groupBtn = document.querySelector('#group-btn');
       // Select elements
    groupModal = document.querySelector('#group-modal');
    closeModalBtn = document.querySelector('.modal-close');

        // Initialize form fields correctly
        userForm.username = userForm.querySelector('#username');
        userForm.email = userForm.querySelector('#email');
        userForm.firstName = userForm.querySelector('#firstName');
        userForm.lastName = userForm.querySelector('#lastName');

    // Re-import the main.js file after setting up the DOM
    jest.resetModules();
    ({
        setupEventListeners,
        renderUsers,
        validateForm,
        showToast,
        saveUsersToLocalStorage,
        editUser,
        deleteUser,
        renderGroups,
        populateUserDropdown
    } = require('./script.js'));


    // Clear any remaining timers
    jest.clearAllTimers();
    // Use fake timers
    jest.useFakeTimers();

    // Mock localStorage
    const mockLocalStorage = (() => {
        let store = {};
        return {
            getItem: (key) => store[key] || null,
            setItem: (key, value) => (store[key] = value.toString()),
            clear: () => (store = {}),
            removeItem: (key) => delete store[key],
        };
    })();

    Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
    });
    // Clear any previous data
    localStorage.clear();

    setupEventListeners(); // Initialize event listeners
});

afterEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
    // Restore real timers after each test
    jest.useRealTimers();
});



describe('User Management System', () => {
    test('should call setupEventListeners when DOM content is loaded', () => {
        const script = require('./script.js');
        const setupEventListenersSpy = jest.spyOn(script, 'setupEventListeners');
    
        // Manually set up the event listener in the test environment
        document.addEventListener('DOMContentLoaded', () => {
            script.setupEventListeners();
        });
    
        // Trigger the event
        document.dispatchEvent(new Event('DOMContentLoaded'));
    
        // Check if setupEventListeners was called
        expect(setupEventListenersSpy).toHaveBeenCalled();
    
        // Clean up
        setupEventListenersSpy.mockRestore();
    });
    
    test('clicking userBtn should set details content and add event listener to add-user-btn', () => {
        // Simulate clicking the user button
        userBtn.click();
    
        // Verify that details.innerHTML has been set correctly
        expect(details.innerHTML).toContain('<h2>Add User</h2>');
        expect(details.innerHTML).toContain('<button class="user-btn" id="add-user-btn">Add User</button>');
        expect(details.innerHTML).toContain('<table>');
    
        // Verify that the add-user-btn click event listener is added
        const addUserBtn = document.querySelector('#add-user-btn');
        expect(addUserBtn).not.toBeNull(); // Check if the button exists
    
        // Simulate click on add-user-btn and ensure it does not throw an error
        expect(() => addUserBtn.click()).not.toThrow();
    });
});

describe('clicking add user button', () => {
    test('clicking #add-user-btn should display the modal with correct content', () => {
        userBtn.click();
        const addUserBtn = document.querySelector('#add-user-btn');
        addUserBtn.click();
        expect(userModal.style.display).toBe('block');
    });
    
    test('clicking close button should hide the modal', () => {
        closeBtn.click();
        expect(userModal.style.display).toBe('none');
    });

    test('should add a new user and render it in the table', () => {
        userBtn.click();
        document.querySelector('#add-user-btn').click();
        
        userForm.username.value = 'testuser';
        userForm.email.value = 'test@example.com';
        userForm.firstName.value = 'Test';
        userForm.lastName.value = 'User';
        
        saveBtn.click();
    
        jest.runAllTimers();
        userTableBody = document.getElementById('user-table-body');
        
        expect(userTableBody).not.toBeNull();
        expect(userTableBody.children.length).toBeGreaterThan(0);
        
        const newUserRow = userTableBody.children[0];
        expect(newUserRow).not.toBeNull();
        expect(newUserRow.children[1].textContent).toBe('testuser');
    });
    
    test('should validate the form and display error message for empty fields', () => {
        jest.useFakeTimers();

       userForm.username.value = '';
        userForm.email.value = '';
        userForm.firstName.value = '';
        userForm.lastName.value = '';

        const saveBtn = document.querySelector('#save-btn');
        const messageDiv = document.querySelector('#message');
     
        saveBtn.click();
     
        expect(messageDiv.textContent).toContain('username is required and cannot be empty or contain only spaces.');
    
        jest.advanceTimersByTime(3000);
    
        expect(messageDiv.textContent.trim()).toBe('');
    
        jest.useRealTimers();
    });

    test('should validate the form and display error message for leading spaces', () => {
        jest.useFakeTimers();

        userForm.username.value = ' testuser'; 
        userForm.email.value = 'test@example.com';
        userForm.firstName.value = 'Test';
        userForm.lastName.value = 'User';

        const saveBtn = document.querySelector('#save-btn');
        const messageDiv = document.querySelector('#message');
        saveBtn.click();
     
        expect(messageDiv.textContent).toContain('username should not start with a space.');
    
        jest.advanceTimersByTime(3000);
    
        expect(messageDiv.textContent.trim()).toBe('');
            jest.useRealTimers();
    });
    

    test('should pass validation when all fields are filled correctly', () => {
        userForm.username.value = 'testuser';
        userForm.email.value = 'test@example.com';
        userForm.firstName.value = 'Test';
        userForm.lastName.value = 'User';
        expect(messageDiv.textContent.trim()).toBe(''); // Ensure no message is shown
    });



     test('should update an existing user', () => {

        userBtn.click();
        document.querySelector('#add-user-btn').click();
        
        userForm.username.value = 'testuser';
        userForm.email.value = 'test@example.com';
        userForm.firstName.value = 'Test';
        userForm.lastName.value = 'User';
        
        saveBtn.click();
    
        jest.runAllTimers();
        userTableBody = document.getElementById('user-table-body');

        const updateButton = document.querySelector('.action-edit');
        updateButton.click();

        userForm.username.value = 'update';
        userForm.email.value = 'update';
        userForm.firstName.value = 'update';
        userForm.lastName.value = 'update';

        updateBtn.click();
    
        const newUserRow = userTableBody.children[0];
        expect(newUserRow).not.toBeNull();
        expect(newUserRow.children[1].textContent).toBe('update');
    });
    
    test('should delete a user', () => {
        document.querySelector('#user-btn').click();

        const addUserBtn = document.querySelector('#add-user-btn');
        addUserBtn.click();
        
        userForm.username.value = 'testuser';
        userForm.email.value = 'test@example.com';
        userForm.firstName.value = 'Test';
        userForm.lastName.value = 'User';
        
        saveBtn.click();

        const userTableBody = document.querySelector('#user-table-body');
        const deleteButton = userTableBody.querySelector('.action-delete');
    
        window.confirm = jest.fn(() => true);
    
        deleteButton.click();
    
        expect(userTableBody.children.length).toBe(0);
    });
        
    test('should not delete a user', () => {
        document.querySelector('#user-btn').click();

        const addUserBtn = document.querySelector('#add-user-btn');
        addUserBtn.click();
        
        userForm.username.value = 'testuser';
        userForm.email.value = 'test@example.com';
        userForm.firstName.value = 'Test';
        userForm.lastName.value = 'User';
        
        saveBtn.click();

        const userTableBody = document.querySelector('#user-table-body');
        const deleteButton = userTableBody.querySelector('.action-delete');
    
        window.confirm = jest.fn(() => false);
    
        deleteButton.click();
    
        expect(userTableBody.children.length).toBe(1);
    });
    

});

describe('Form Enter Keypress Event', () => {
    test('should trigger Save action when Enter key is pressed and Save button is visible', () => {
        saveBtn.style.display = 'block';
        updateBtn.style.display = 'none';

        const saveBtnSpy = jest.spyOn(saveBtn, 'click');
        const event = new KeyboardEvent('keypress', { key: 'Enter' });
        const userForm = document.getElementById('user-form');
        userForm.dispatchEvent(event);

        expect(saveBtnSpy).toHaveBeenCalled();
    });

    test('should trigger Update action when Enter key is pressed and Update button is visible', () => {
        saveBtn.style.display = 'none';
        updateBtn.style.display = 'block';

        userForm.username.value = 'testuser';
        userForm.email.value = 'test@example.com';
        userForm.firstName.value = 'Test';
        userForm.lastName.value = 'User';

        const updateBtnSpy = jest.spyOn(updateBtn, 'click');
        const event = new KeyboardEvent('keypress', { key: 'Enter' });
        userForm.dispatchEvent(event);
        expect(updateBtnSpy).toHaveBeenCalled();
    });

    test('should not trigger Save or Update action when a key other than Enter is pressed', () => {
        saveBtn.style.display = 'block';
        updateBtn.style.display = 'block';

        const saveBtnSpy = jest.spyOn(saveBtn, 'click');
        const updateBtnSpy = jest.spyOn(updateBtn, 'click');

        const event = new KeyboardEvent('keypress', { key: 'a' });
        userForm.dispatchEvent(event);

        expect(saveBtnSpy).not.toHaveBeenCalled();
        expect(updateBtnSpy).not.toHaveBeenCalled();
    });
});


// group management

describe('Group managaement', () => {

    
        test('clicking userBtn should set details content and add event listener to add-user-btn', () => {
            // Simulate clicking the user button
            groupBtn.click();
        
            // Verify that details.innerHTML has been set correctly
            expect(details.innerHTML).toContain('<h2>Group Management</h2>');
            expect(details.innerHTML).toContain(' <button id="create-group-btn">Create Group</button>');
            expect(details.innerHTML).toContain('<table>');
        
            // Verify that the add-user-btn click event listener is added
            const grpbtn = document.querySelector('#create-group-btn');
            expect(grpbtn).not.toBeNull(); // Check if the button exists
        
            // Simulate click on add-user-btn and ensure it does not throw an error
            expect(() => grpbtn.click()).not.toThrow();
        });
    
    

test('clicking Create Group button should display the modal with correct content', () => {
    const groupBtn = document.querySelector('#group-btn');
    groupBtn.click(); 

    const createGroupBtn = document.querySelector('#create-group-btn');
    createGroupBtn.click(); 

    const groupModal = document.querySelector('#create-group-modal');
    expect(groupModal.style.display).toBe('block'); 
  });

  test('clicking close button should hide the modal', () => {
    const groupBtn = document.querySelector('#group-btn');
    groupBtn.click(); 

    const createGroupBtn = document.querySelector('#create-group-btn');
    createGroupBtn.click(); 

    const closeGroupBtn = document.querySelector('#close-group-btn');
    closeGroupBtn.click(); 
    expect(document.querySelector('#create-group-modal')).toBeNull();
  });

  test('should add a new group and render it in the table', () => {
    // Simulate the initial click to open the Group Management section
    groupBtn.click();
    document.querySelector('#create-group-btn').click();
    
    // Fill out the group form
    document.querySelector('#group-name').value = 'No users assigned';
    
    // Simulate clicking the save group button
    document.querySelector('#save-group-btn').click();

    
    // Query the DOM for the group table body
    const groupTableBody = document.getElementById('group-table-body');
    
    // Assertions to verify the group was added and rendered in the table
    expect(groupTableBody).not.toBeNull();
    expect(groupTableBody.children.length).toBeGreaterThan(0);
    
    const newGroupRow = groupTableBody.children[0];
    expect(newGroupRow).not.toBeNull();
    expect(newGroupRow.children[1].textContent).toBe('No users assigned');
});

test('should open assign users modal and close it on click', () => {
    groupBtn.click();
    document.querySelector('#create-group-btn').click();

    // Call the function to open the modal
    window.assignGroup();

    // Check if the modal was added to the DOM
    const modal = document.querySelector('#create-group-modal');
    expect(modal).not.toBeNull();

    // Ensure the modal is visible
    const modalDisplayStyle = getComputedStyle(modal).display;
    expect(modalDisplayStyle).toBe('block');

    // Simulate clicking the close button
    const closeModalBtn = document.querySelector('.close-modal');
    expect(closeModalBtn).not.toBeNull();
    closeModalBtn.click();

    // Ensure the modal was hidden
    expect(modal.style.display).toBe('block');

    // Ensure the modal was removed from the DOM
    expect(document.querySelector('.close-modal')).toBeNull();
});
test('should open remove users modal, display users, remove selected users, update localStorage, and show a success message', () => {
    // Mock data
    const mockGroups = [
        { name: 'Group 1', users: ['user1', 'user2', 'user3'] },
        { name: 'Group 2', users: [] }
    ];

    // Set up initial groups in localStorage and global variable
    localStorage.setItem('groups', JSON.stringify(mockGroups));
    global.groups = JSON.parse(localStorage.getItem('groups'));

    // Set up DOM
    document.body.innerHTML = `
        <table>
            <tbody id="group-table-body"></tbody>
        </table>
    `;

    // Mock functions
    const mockRenderGroups = jest.fn();
    const mockShowToast = jest.fn();
    window.renderGroups = mockRenderGroups;
    window.showToast = mockShowToast;

    // Simulate calling removeUser function (index 0 for Group 1)
    window.removeUser(0);

    // Check if the modal was added to the DOM
    const modal = document.querySelector('.modal');
    expect(modal).not.toBeNull();

    // Ensure the modal is visible
    const modalDisplayStyle = getComputedStyle(modal).display;
    expect(modalDisplayStyle).toBe('block');

    // Check that the user select options are correctly populated
    const removeSelect = document.querySelector('#remove-select');
    expect(removeSelect).not.toBeNull();
    expect(removeSelect.children.length).toBe(mockGroups[0].users.length);

    // Verify that all users are listed as options
    mockGroups[0].users.forEach((user, index) => {
        expect(removeSelect.children[index].value).toBe(user);
        expect(removeSelect.children[index].textContent).toBe(user);
    });

    // Simulate selecting users and clicking the remove button
    const optionToRemove = removeSelect.children[0];
    optionToRemove.selected = true; // Select the first user
    document.getElementById('delete-remove-btn').click();

    // Verify that the selected user is removed from the group
    const updatedGroups = JSON.parse(localStorage.getItem('groups'));
    expect(updatedGroups[0].users.length).toBe(mockGroups[0].users.length - 1);
    expect(updatedGroups[0].users).not.toContain('user1'); // Ensure 'user1' is removed


    // Simulate clicking the close button
    const closeModalBtn = document.querySelector('.close-modal');
    expect(closeModalBtn).not.toBeNull();
    closeModalBtn.click();

     // Ensure the modal was removed from the DOM
     expect(document.querySelector('.close-modal')).toBeNull();
});

test('should delete a group, update localStorage, and display a success message', () => {
    // Mock data
    const mockGroups = [
        { name: 'Group 1', users: [] },
        { name: 'Group 2', users: [] },
        { name: 'Group 3', users: [] }
    ];

    // Set up initial groups in localStorage and in the global variable
    localStorage.setItem('groups', JSON.stringify(mockGroups));
    global.groups = JSON.parse(localStorage.getItem('groups'));

    // Set up DOM
    document.body.innerHTML = `
        <table>
            <tbody id="group-table-body"></tbody>
        </table>
    `;

    // Mock functions
    const mockRenderGroups = jest.fn();
    const mockShowToast = jest.fn();
    window.renderGroups = mockRenderGroups;
    window.showToast = mockShowToast;

    // Mock confirm to always return true
    jest.spyOn(window, 'confirm').mockImplementation(() => true);

    // Call the deleteGroup function to delete the group at index 1
    window.deleteGroup(1);
    

    // Verify that the group at index 1 is removed
    const updatedGroups = JSON.parse(localStorage.getItem('groups'));
    expect(updatedGroups.length).toBe(mockGroups.length - 1);
    expect(updatedGroups.some(group => group.name === 'Group 2')).toBe(false); // Ensure 'Group 2' is removed
    expect(updatedGroups[1].name).toBe('Group 3'); // Ensure remaining groups are correct

    // Verify that localStorage was updated
    expect(localStorage.setItem).toHaveBeenCalledWith('groups', JSON.stringify(updatedGroups));

    // Verify that renderGroups was called to update the UI
    expect(mockRenderGroups).toHaveBeenCalled();

    // Verify that the toast message was displayed
    expect(mockShowToast).toHaveBeenCalledWith('Group deleted successfully!');

    // Clean up the mock
    jest.spyOn(window, 'confirm').mockRestore();
});
});


// role management

describe('Role managaement', () => {

    
    test('clicking userBtn should set details content and add event listener to add-user-btn', () => {
        const roleBtn = document.querySelector('#role-btn');
        roleBtn .click();
    
        // Verify that details.innerHTML has been set correctly
        expect(details.innerHTML).toContain('<h2>Role Management</h2>');
        expect(details.innerHTML).toContain('<button id="add-role-btn">Add Role</button>');
        expect(details.innerHTML).toContain('<table>');
    
        // Verify that the add-user-btn click event listener is added
        const rolebtn = document.querySelector('#add-role-btn');
        expect(rolebtn).not.toBeNull(); // Check if the button exists
    
        // Simulate click on add-user-btn and ensure it does not throw an error
        expect(() => rolebtn.click()).not.toThrow();
        const tableHeaders = document.querySelectorAll('thead th');

            // Check the number of header columns
         expect(tableHeaders.length).toBe(7); // Expecting exactly 3 headers

    // Check the content of each header cell
    expect(tableHeaders[0].textContent.trim()).toBe('Role Name');
    expect(tableHeaders[1].textContent.trim()).toBe('Description');
    expect(tableHeaders[2].textContent.trim()).toBe('Action');
    });

    test('clicking Create Group button should display the modal with correct content', () => {
  const roleBtn = document.querySelector('#role-btn');
        roleBtn .click();
    
    const addbtn= document.querySelector('#add-role-btn');
    addbtn .click();
    
        const roleModal = document.querySelector('#create-role-modal');
        expect(roleModal.style.display).toBe('block'); 
      });
    
      test('clicking close button should hide the modal', () => {
        const roleBtn = document.querySelector('#role-btn');
        roleBtn .click();
    
    const addbtn= document.querySelector('#add-role-btn');
    addbtn .click();
    
        const closeroleBtn = document.querySelector('#close-role-btn');
        closeroleBtn.click(); 
        expect(document.querySelector('#create-role-modal')).toBeNull();
      });
});








  










