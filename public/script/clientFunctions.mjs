"use strict"

import * as main from "../AvatarStudio/Script/main.mjs";
import { avatarFeatures } from "../AvatarStudio/Script/scene.mjs";

const url = 'user/users';
const avatarUrl = "user/avatar";

export async function loginUser() {
    // Get user credentials from the input fields
    const email = document.getElementById('inpEmailLogin').value;
    const password = document.getElementById('inpPasswordLogin').value;
    const authorization = encode(email, password);

    try {
        const response = await fetch('user/login', {
            method: 'POST',
            headers: {
                'Authorization': authorization,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (response.ok) {
            console.log('Login successful:', data);
            displayMsg("Successful login", 'green');

            //might only need to return a token that times out and give privileges that lets users/admin do different stuff

            sessionStorage.setItem("loggedInId", data.user.id);
            sessionStorage.setItem("loggedInEmail", data.user.uEmail);
            sessionStorage.setItem("loggedInName", data.user.uName);
            sessionStorage.setItem("loggedInPassword", data.user.password);

            if (data.avatar !== null) {
                localStorage.setItem('haircolor', data.avatar.hairColor);
                localStorage.setItem('eyecolor', data.avatar.eyeColor);
                localStorage.setItem('skincolor', data.avatar.skinColor);
                localStorage.setItem('browtype', data.avatar.eyeBrowType);
                sessionStorage.setItem('avatarId', data.avatar.avatarId);
            }

            if (data.user.role === "admin") {
                sessionStorage.setItem("role", data.user.role);
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

async function loggedInShowAvatar() {

    const loggedInId = sessionStorage.getItem("loggedInId");
    const loggedInEmail = sessionStorage.getItem("loggedInEmail");
    const loggedInName = sessionStorage.getItem("loggedInName");
    const loggedInPassword = sessionStorage.getItem("loggedInPassword");
    const avatarId = sessionStorage.getItem("avatarId");

    if (avatarId != null) {

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
            console.error('Error showing Avatar user:' + error);
        }
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

function encode(anEmail, aPassword) {
    const credentials = anEmail + ":" + aPassword;
    return "Basic " + btoa(credentials);
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