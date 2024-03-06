"use strict"
import * as requests from "./clientRequests.mjs"
import * as functions from "./functions.mjs"
import * as main from "../AvatarStudio/Script/main.mjs";
/*-------------HTML elements by ID-------------------- */

const createUserText = document.getElementById('createUtext');
const myAccountBtn = document.getElementById('myAccountBtn');
const bntContainerLoggedIn = document.getElementById('bntContainerLoggedIn');
const editUserForm = document.getElementById('editUser');
const deleteBtn = document.getElementById('deleteUserBtn');

/*------- Header Events ------ */

myAccountBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    if (editUserForm.style.display === "none") {
        editUserForm.style.display = 'block';
        bntContainerLoggedIn.style.display = "block";
    } else {
        editUserForm.style.display = "none";
        bntContainerLoggedIn.style.display = "none";
    }
});

const toggleModeBtn = document.getElementById('toggleModeBtn');
toggleModeBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-mode');
});

/* ------------ site content ----------------*/

await requests.loggedInShowAvatar();

const loginForm = document.getElementById('login');
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    requests.loginUser();
});

const createForm = document.getElementById('create');
createForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    requests.addUser()
});

const loginText = document.getElementById('loginText');
document.addEventListener('click', (event) => {
    if (event.target === createUserText || event.target === loginText) {
        event.preventDefault();
        functions.displayCreateNewUser();
    }
});

editUserForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    requests.sendEditUser();
});
const logOutUser = document.getElementById('logOutUser');
logOutUser.addEventListener("click", () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
});

deleteBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    requests.deleteUser();
})

/* ------------avatar events----------------- */
const saveBtn = document.getElementById("checkBtn");
saveBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    requests.saveAvatar();
});

const mainBtn = document.getElementById("mainBtn");
mainBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    main.saveImage();
});
