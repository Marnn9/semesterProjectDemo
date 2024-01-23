"use strict"

export function addUser() {
    // Fetch user data from the form
    const name = document.getElementById('inpUname').value;
    const email = document.getElementById('inpEmail').value;
    const password = document.getElementById('inpPassword').value;

    // Create a user object
    const user = { name, email, password };

    // Send a POST request to the server to add the user
    fetch('http://localhost:8080/user/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    })
        .then(response => response.json())
        .then(data => {
            console.log('User:', data);
            // Add the user to the user list
            displayUser(data);
        })
        .catch(error => {
            console.error('Error adding user:', error);
        });
}
export function displayAllUsers() {
    const userList = document.getElementById('userList');

    // Clear existing user list
    userList.innerHTML = '';

    // Fetch all users from the server
    fetch('http://localhost:8080/user/users')
        .then(response => response.json())
        .then(users => {
            console.log('User list:', users);

            // Display each user in the user list
            users.forEach(user => displayUser(user));
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
}

// Function to display a user in the user list
export function displayUser(user) {
    const userList = document.getElementById('userList');
    const listItem = document.createElement('li');

    // Check if user is undefined before accessing properties
    if (user) {
        listItem.textContent = `Name: ${user.name}, Email: ${user.email}`;
    } else {
        listItem.textContent = 'User information not available';
    }

    userList.appendChild(listItem);
}