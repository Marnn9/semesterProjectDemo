"use strict"
import * as main from "./AvatarStudio/Script/main.mjs";

const url = 'user/users';
        const avatarUrl = "user/avatar";

        const createUserText = document.getElementById('createUtext');
        const myAccountBtn = document.getElementById('myAccountBtn');
        const bntContainerLoggedIn = document.getElementById('bntContainerLoggedIn');
        const editUserForm = document.getElementById('editUser');
        const loginForms = document.getElementById('loginForms');
        const avatarStudioEvents = document.getElementById('avatarStudioEvents');
        const deleteBtn = document.getElementById('deleteUserBtn');
        const displayBtnAdmin = document.getElementById("displayUsers");

        let selectedUserId = null;

        export async function loginUser() {
            // Get user credentials from the input fields
            const email = document.getElementById('inpEmailLogin').value;
            const password = document.getElementById('inpPasswordLogin').value;

            const authorization = new Headers();
            authorization.append("Authorization", encode(email, password));

            const user = { email, password };

            try {
                const response = await fetch('user/login', {
                    method: 'POST',
                    headers: {
                        authorization,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user),
                });

                const data = await response.json();
                if (response.ok) {
                    console.log('Login successful:', data);
                    displayMsg("Successful login", 'green');

                    //might only need to return a token that times out and give privileges that lets users/admin do different stuff

                    sessionStorage.setItem("loggedInId", data.user.id);
                    sessionStorage.setItem("loggedInEmail", data.user.email);
                    sessionStorage.setItem("loggedInName", data.user.name);
                    sessionStorage.setItem("loggedInPassword", data.user.paswHash);

                    if (data.avatar !== null) {
                        localStorage.setItem('haircolor', data.avatar.hairColor);
                        localStorage.setItem('eyecolor', data.avatar.eyeColor);
                        localStorage.setItem('skincolor', data.avatar.skinColor);
                        localStorage.setItem('browtype', data.avatar.eyeBrowType);
                        sessionStorage.setItem('avatarId', data.avatar.avatarId);
                    }

                    if (data.role === "admin") {
                        sessionStorage.setItem("role", data.role);
                        showAdminFields();
                    }
                    await loggedInShowAvatar();
                } else {
                    console.error(`Error: ${response.status} - ${data.error}`);
                    displayMsg(data.error, 'red')
                }

            } catch (error) {
                console.error('Error during login:', error);
                connectionLost(error);
                // Handle the error or display a message to the user
            }
        }

        if (sessionStorage.getItem("role") === "admin") {
            showAdminFields();
        }

        function showAdminFields() {
            displayBtnAdmin.style.display = "block";
            const inpEmailEdit = document.getElementById("inpEmailEdit");
            inpEmailEdit.style.display = "none";
        }

        export async function displayAllUsers() {
            try {
                const userList = document.getElementById('userList');
                userList.innerHTML = '';

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                console.log('Response from server:', data);

                if (Array.isArray(data)) {
                    data.forEach(user => displayUser(user));
                } else {
                    console.error('Invalid response from server:', data);
                }
            } catch (error) {
                console.error('Error fetching users:', error.message);
                displayMsg(`Error fetching users: ${error.message}`);
            }
        }
        // Function to select a user by ID
        function selectUser(userId, userName, userEpost, userPassword) {
            selectedUserId = userId;
            selectedUserName = userName;
            selectedUserEpost = userEpost;
            selectedUserPassword = userPassword;
        }

        // Function to display a user in the user list
        function displayUser(user) {
            const userList = document.getElementById('userList');

            const titleElement = document.createElement('h2');
            titleElement.textContent = 'Users';
            userList.appendChild(titleElement);

            const listItem = document.createElement('li');

            // Check if user is undefined before accessing properties
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

        const loggedInId = sessionStorage.getItem("loggedInId");
        const loggedInEmail = sessionStorage.getItem("loggedInEmail");
        const loggedInName = sessionStorage.getItem("loggedInName");
        const loggedInPassword = sessionStorage.getItem("loggedInPassword")
        const loggedInRole = sessionStorage.getItem("role");

        await loggedInShowAvatar();

       export  async function saveAvatar() {
            try {
                avatarFeatures.loggedInUser = loggedInId;
                const response = await fetch(avatarUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(avatarFeatures),
                });
                const data = await response.json();
                if (response.ok) {

                    displayMsg("Saved", 'green');
                    console.log('Saved:', data);
                }
            } catch (error) {
                console.error("Bad Input", error);
            }
        };

       export async function addUser() {

            const name = document.getElementById('inpUname').value;
            const email = document.getElementById('inpEmail').value;
            const password = document.getElementById('inpPassword').value;
            // Create a user object
            const user = { name, email, password };
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user),
                })
                const data = await response.json();

                if (response.ok) {
                    window.location.reload();
                    console.log(data)
                } else {
                    const errorData = await response.json();
                    console.error(`Error: ${response.status} - ${errorData.error}`);
                    displayMsg(errorData.error, 'red')
                }

            } catch (error) {
                console.error(`Error during user Creation: ${error.message}`);
            }
        }

       export async function sendEditUser() {
            let name = document.getElementById('inpUnameEdit').value;
            let email = document.getElementById('inpEmailEdit').value;
            let password = document.getElementById('inpPasswordEdit').value;

            if (!name) {
                name = loggedInName;
            }

            if (!email) {
                email = loggedInEmail;
            }

            if (!password) {
                password = loggedInPassword;
            }

            if (name && email && password && loggedInId) {
                const editedUser = { email, loggedInId, name, password };

                try {
                    const response = await fetch(url + "/" + loggedInId, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(editedUser),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error(`Error: ${response.status} - ${errorData.error}`);
                        displayMsg(errorData.error, 'red')
                    }

                    const data = await response.json();
                    console.log('Edited User:', data);
                    displayMsg("User updated", 'green');

                } catch (error) {
                    console.error('Error during login:', error);
                }
            } else {
                console.error('Missing data in fields for editing user or no user logged In');
            }
        }

        export async function deleteUser() {
            const deleteConfirm = confirm("Are you sure you want to delete the user?");

            if (deleteConfirm && loggedInId && (loggedInRole !== "admin")) {
                try {
                    const response = await fetch(url + "/" + loggedInId, {
                        method: 'DELETE',
                    });

                    const data = await response.json();
                    if (response.ok) {
                        console.log('Deleted user:', data);
                        localStorage.clear();
                        window.location.reload();
                    } else {
                        console.error(`Error: ${response.status} - ${data.error}`);
                        displayMsg(data.error, 'red')
                    }
                } catch (error) {
                    console.error('Error deleting user:', error);
                }
            } else if (!deleteConfirm) {
                displayMsg("deleting canceled", 'orange');
            } else if (loggedInRole === "admin") {
                try {
                    const response = await fetch(url + "/" + selectedUserId, {
                        method: 'DELETE',
                    });
                    const data = await response.json();
                    if (response.ok) {
                        console.log('Deleted user:', data);
                        localStorage.clear();
                    } else {
                        console.error(`Error: ${response.status} - ${data.error}`);
                        displayMsg(data.error, 'red')
                    }
                } catch (error) {
                    console.error('Error deleting user:', error);
                }
            }
            else {
                return;
            }
        }

        async function loggedInShowAvatar() {

            const loggedInId = sessionStorage.getItem("loggedInId");
            const loggedInEmail = sessionStorage.getItem("loggedInEmail");
            const loggedInName = sessionStorage.getItem("loggedInName");
            const loggedInPassword = sessionStorage.getItem("loggedInPassword");
            const avatarId = sessionStorage.getItem("avatarId");

            try {
                const response = await fetch(avatarUrl + "/" + avatarId, {
                    method: 'GET',
                });
                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem("haircolor", data.hairColor);
                    localStorage.setItem("eyecolor", data.eyeColor);
                    localStorage.setItem("skincolor", data.skinColor);
                    localStorage.setItem("browtype", data.eyeBrowType);

                } else {
                    console.error(`Error: ${response.status} - ${data.error}`);
                    displayMsg(data.error, 'red')
                }

            } catch (error) {
                console.error('Error showing Avatar user:', error);
            }

            if (loggedInId && loggedInEmail && loggedInName && loggedInPassword !== null) {

                myAccountBtn.style.display = "block";
                loginForms.style.display = 'none';
                main.loadScene();
                avatarStudioEvents.style.display = 'block';
            } else {
                return;
            }
        }

        export function displayCreateNewUser() {
            const loginForm = document.getElementById('login');
            const createNewUserForm = document.getElementById('create');
            const displayUserText = document.getElementById('createUtext');
            const loginText = document.getElementById('loginText');

            if (loginForm.style.display !== 'none') {

                loginForm.style.display = 'none';
                createNewUserForm.style.display = 'block';
                displayUserText.style.display = 'none';
                loginText.style.display = 'block';

            } else {

                loginForm.style.display = 'block';
                createNewUserForm.style.display = 'none';
                displayUserText.style.display = 'block';
                loginText.style.display = 'none';
            }

        }
        
        function displayMsg(aMsg, aColor) {
            const messageDisplayContainerId = "messageDisplayContainer";
            let messageDisplay = document.getElementById(messageDisplayContainerId);

            if (!messageDisplay) {
                messageDisplay = document.createElement("div");
                messageDisplay.id = messageDisplayContainerId;
                document.body.appendChild(messageDisplay);
            }
            messageDisplay.style.color = aColor;
            messageDisplay.textContent = aMsg;

            setTimeout(() => {
                document.body.removeChild(messageDisplay);
            }, 5000);
        }

        function connectionLost(error) {
            if (error.message && error.message.includes('Failed to fetch')) {
                alert("Connection lost, this page will now be refreshed");
                window.location.reload();
            }
        }

        function encode(anEmail, aPassword) {
            const credentials = anEmail + ":" + aPassword;
            return "basic " + btoa(credentials);
        }

        function saveImage() {
            //logic for saving an image from the canvas
        }

        /* fetch(url)
        .then((response) => response.json)
        .then((data) => {
            console.log(data)
        }).catch()//ha en catch her også
        .catch((error) console.error("feil" , error));
        */