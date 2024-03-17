"use strict"
import * as functions from "./functions.mjs"

//make this happen in the server?
if (sessionStorage.getItem("role") === "admin") {
    functions.showAdminFields();
}
const displayBtnAdmin = document.getElementById("displayUsers");
const userList = document.getElementById('userList');
const url = 'user/users';

let userListVisible = false;
export let selectedUserId = null;
let selectedUserName = null;
let selectedUserEpost = null;
let selectedUserPassword = null;

displayBtnAdmin.addEventListener('click', async (event) => {
    event.preventDefault();

    if (userListVisible) {
        hideUserList();
        selectedUserId = null;
    } else {
        displayAllUsers();
    }
});

async function displayAllUsers() {
    try {
        userList.innerHTML = ' ';
        const response = await functions.globalFetch('GET', url);
        const data = await response.json();

        if (!response.ok) {
            functions.responseNotOk(response, data);
        }
        console.log('Response from server:', data);

        if (Array.isArray(data)) {
            data.forEach(user => displayUser(user));
            showUserList();
        } else {
            console.error('Invalid response from server:', data);
        }
    } catch (error) {
        console.error('Error fetching users:', error.message);
        functions.displayMsg(`Error fetching users: ${error.message}`);
    }
}

function showUserList() {
    userList.style.display = 'grid';
    userListVisible = true;
}

export function hideUserList() {
    userList.style.display = 'none';
    userListVisible = false;
}

function selectUser(userId, userName, userEpost, userPassword) {
    selectedUserId = userId;
    selectedUserName = userName;
    selectedUserEpost = userEpost;
    selectedUserPassword = userPassword;
}

function displayUser(user) {
    const userList = document.getElementById('userList');

    const listItem = document.createElement('li');

    if (user) {
        listItem.innerHTML = `<i>User</i> : Id: <b>${user.id}</b>, Name: <b>${user.uName}</b>, E-mail: <b>${user.uEmail}</b>, AvatarId: <b>${user.anAvatarId}</b>, Role: <b>${user.role}</b>`;
        userList.appendChild(listItem);
        listItem.classList.add('listed_users');

        listItem.addEventListener('click', () => {
            selectUser(user.id, user.uName, user.uEmail, user.password);
            const allListItems = document.querySelectorAll('.listed_users');
            allListItems.forEach(item => item.classList.remove('selected-user'));
            listItem.classList.add('selected-user');
        });
    } else {
        listItem.textContent = 'User information not available';
    }
    userList.appendChild(listItem);
}

