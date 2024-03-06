"use strict"

const displayBtnAdmin = document.getElementById("displayUsers");

export function encode(anEmail, aPassword) {
    const credentials = anEmail + ":" + aPassword;
    return "Basic " + btoa(credentials);
}

export function displayMsg(aMsg, aColor) {
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

export function connectionLost(error) {
    if (error.message && error.message.includes('Failed to fetch')) {
        alert("Connection lost, this page will now be refreshed");
        window.location.reload();
    }
}

export function showAdminFields() {
    displayBtnAdmin.style.display = "inline-block";
    const inpEmailEdit = document.getElementById("inpEmailEdit");
    inpEmailEdit.style.display = "none";
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

export function checkStorage() {
    const loggedInId = sessionStorage.getItem("loggedInId");
    const loggedInEmail = sessionStorage.getItem("loggedInEmail");
    const loggedInName = sessionStorage.getItem("loggedInName");
    const loggedInPassword = sessionStorage.getItem("loggedInPassword")
    const loggedInRole = sessionStorage.getItem("role");

    return { loggedInId, loggedInEmail, loggedInName, loggedInPassword, loggedInRole };
}
