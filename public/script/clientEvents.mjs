"use strict"
import * as client from "./clientFunctions.mjs"


        const createUserText = document.getElementById('createUtext');
        const myAccountBtn = document.getElementById('myAccountBtn');
        const bntContainerLoggedIn = document.getElementById('bntContainerLoggedIn');
        const editUserForm = document.getElementById('editUser');
        const loginForms = document.getElementById('loginForms');
        const avatarStudioEvents = document.getElementById('avatarStudioEvents');
        const deleteBtn = document.getElementById('deleteUserBtn');
        const displayBtnAdmin = document.getElementById("displayUsers");

        let selectedUserId = null;

        const logOutUser = document.getElementById('logOutUser');
        logOutUser.addEventListener("click", () => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();
        })

        const toggleModeBtn = document.getElementById('toggleModeBtn');
        toggleModeBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark-mode');
        })

        const loginText = document.getElementById('loginText');
        document.addEventListener('click', (event) => {
            if (event.target === createUserText || event.target === loginText) {
                event.preventDefault();
                client.displayCreateNewUser();
            }
        });

        const saveBtn = document.getElementById("checkBtn");
        saveBtn.addEventListener("click", async (event) => {
            event.preventDefault();
            client.saveAvatar();
        });

        const loginForm = document.getElementById('login');
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            client.loginUser();
        });


        

        if (sessionStorage.getItem("role") === "admin") {
            client.showAdminFields();
        }

        displayBtnAdmin.addEventListener("click", async (event) => {
            event.preventDefault();
            client.displayAllUsers();
        });
       
        // Function to select a user by ID
        const loggedInId = sessionStorage.getItem("loggedInId");
        const loggedInEmail = sessionStorage.getItem("loggedInEmail");
        const loggedInName = sessionStorage.getItem("loggedInName");
        const loggedInPassword = sessionStorage.getItem("loggedInPassword")
        const loggedInRole = sessionStorage.getItem("role");

        const createForm = document.getElementById('create');
        createForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            client.addUser()
        });

        myAccountBtn.addEventListener("click", async (event) => {
            event.preventDefault();
            if (editUserForm.style.display === "none") {
                editUserForm.style.display = 'block';
                bntContainerLoggedIn.style.display = "block";
            } else {
                editUserForm.style.display = "none";
                bntContainerLoggedIn.style.display = "none";
            }
        })

        editUserForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            client.sendEditUser();
        })

        deleteBtn.addEventListener('click', async (event) => {
            event.preventDefault();
            client.deleteUser();
        })

       