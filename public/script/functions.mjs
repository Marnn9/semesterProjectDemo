"use strict"
import * as main from "../AvatarStudio/scriptAvatar/main.mjs";

const displayBtnAdmin = document.getElementById("displayUsers");

export function encode(anEmail, aPassword) {
    const credentials = anEmail + ":" + aPassword;
    return "Basic " + btoa(credentials);
}

export function encodeId(anId, anEmail) {
    const credentials = anId + ":" + anEmail;
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

export function displayServerMsg() {
    displayMsg('An error ocurred, trying to reach the server', 'red')
}

export function connectionLost(error) {
    if (error.message && (error.message.includes('Failed to fetch') ||  error.message.includes('Network Error'))) {
        alert("Connection lost, this page will now be refreshed");
        window.location.reload();
    }
}

export function loadAvatarScene() {
    const myAccountBtn = document.getElementById("myAccountBtn");
    const languageSelection = document.getElementById("languageSelection");
    const loginForms = document.getElementById('loginForms');
    const avatarStudioEvents = document.getElementById('avatarStudioEvents');

    myAccountBtn.style.display = "block";
    loginForms.style.display = 'none';
    main.loadScene();
    avatarStudioEvents.style.display = 'block';
    languageSelection.style.display = 'none';
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
    const loggedInRole = sessionStorage.getItem("role");
    const token = sessionStorage.getItem("token");

    return { loggedInId, loggedInRole, token };
}

export async function globalFetch(aMethod, anUrl, aBodyElement) {

    try {
        const response = await fetch(anUrl, {
            method: aMethod,
            headers: {
                Authorization: checkStorage().token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(aBodyElement),
        });
        return response;
    } catch (error) {
        console.error("An error during " + aMethod + " for url " + anUrl, error);
        displayServerMsg();
        connectionLost(error);
    }
}

export function responseNotOk(aResponse, someData) {
    console.error(`Error: ${aResponse.status} - ${someData.error}`);
    displayMsg(someData.error, 'red');
    connectionLost(someData.error);

    if (someData.error && someData.error.includes('Token timed out')) {
        sessionStorage.clear();
        localStorage.clear();
    }
}

export function avatarToStorage(data) {
    localStorage.setItem('haircolor', data.hairColor);
    localStorage.setItem('eyecolor', data.eyeColor);
    localStorage.setItem('skincolor', data.skinColor);
    localStorage.setItem('browtype', data.browType);
    sessionStorage.setItem('avatarId', data.avatarId);
}

export function avatarToStorageLogin(data) {
    localStorage.setItem('haircolor', data.avatar.hairColor);
    localStorage.setItem('eyecolor', data.avatar.eyeColor);
    localStorage.setItem('skincolor', data.avatar.skinColor);
    localStorage.setItem('browtype', data.avatar.eyeBrowType);
    sessionStorage.setItem('avatarId', data.avatar.avatarId);
}

