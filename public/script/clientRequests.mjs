"use strict"
import * as main from "../AvatarStudio/Script/main.mjs";
import * as functions from "./functions.mjs"
import { avatarFeatures } from "../AvatarStudio/Script/scene.mjs";
import { selectedUserId } from "./admin.mjs";

const url = 'user/users';
const avatarUrl = "user/avatar";
const loginForms = document.getElementById('loginForms');
const avatarStudioEvents = document.getElementById('avatarStudioEvents');

export async function loginUser() {
    // Get user credentials from the input fields
    const email = document.getElementById('inpEmailLogin').value;
    const password = document.getElementById('inpPasswordLogin').value;
    const authorization = functions.encode(email, password);

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
            functions.displayMsg("Successful login", 'green');

            //might only need to return a token that times out and give privileges that lets users/admin do different stuff

            sessionStorage.setItem("loggedInId", data.user.id);
            sessionStorage.setItem("loggedInEmail", data.user.uEmail);
            sessionStorage.setItem("loggedInName", data.user.uName);
            sessionStorage.setItem("loggedInPassword", data.user.password);
            sessionStorage.setItem("token", data.token);

            if (data.avatar !== null) {
                localStorage.setItem('haircolor', data.avatar.hairColor);
                localStorage.setItem('eyecolor', data.avatar.eyeColor);
                localStorage.setItem('skincolor', data.avatar.skinColor);
                localStorage.setItem('browtype', data.avatar.eyeBrowType);
                sessionStorage.setItem('avatarId', data.avatar.avatarId);
            }

            if (data.user.role === "admin") {
                sessionStorage.setItem("role", data.user.role);
                functions.showAdminFields();
            }
            await loggedInShowAvatar();
        } else {
            console.error(`Error: ${response.status} - ${data.error}`);
            functions.displayMsg(data.error, 'red')
        }

    } catch (error) {
        console.error('Error during login:', error);
        functions.displayServerMsg();
        functions.connectionLost(error);
    }
}

export async function addUser() {
    const name = document.getElementById('inpUname').value;
    const email = document.getElementById('inpEmail').value;
    const password = document.getElementById('inpPassword').value;

    const user = { name, email, password };
    const response = await functions.globalFetch('POST', url, user);

    try {
        if (response.ok) {
            const data = await response.json();
            window.location.reload();
            console.log(data);
        } else {
            const errorData = await response.json();
            console.error(`Error: ${response.status} - ${errorData.error}`);
            functions.displayMsg(errorData.error, 'red');
        }
    } catch (error) {
        console.error("An error occurred while processing the response", error);
        functions.displayServerMsg();
        functions.connectionLost(error);
    }
}

export async function sendEditUser() {
    let name = document.getElementById('inpUnameEdit').value;
    let email = document.getElementById('inpEmailEdit').value;
    let password = document.getElementById('inpPasswordEdit').value;
    const loggedId = functions.checkStorage().loggedInId;

    if (!name) {
        name = functions.checkStorage().loggedInName;
    }

    if (!email) {
        email = functions.checkStorage().loggedInEmail;
    }

    if (!password) {
        password = functions.checkStorage().loggedInPassword;
    }

    if (name && email && password && loggedId) {
        const editedUser = { email, loggedId, name, password };
        try {
            const response = await fetch(url + "/" + loggedId, {
                method: 'PUT',
                headers: {
                    Authorization: functions.checkStorage().token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedUser),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error(`Error: ${response.status} - ${errorData.error}`);
                functions.displayMsg(errorData.error, 'red')
            } else {
                const data = await response.json();
                console.log('Edited User:', data);
                functions.displayMsg("User updated", 'green');
            }

        } catch (error) {
            console.error('Error updating user:', error);
            functions.connectionLost(error);
            functions.displayServerMsg();
        }
    } else {
        console.error('Missing data in fields for editing user or no user logged In');
        functions.displayMsg('Missing data in fields for editing user or no user logged In', 'red');
    }
}

export async function saveAvatar() {
    try {
        avatarFeatures.loggedInUser = functions.checkStorage().loggedInId;
        const response = await fetch(avatarUrl, {
            method: 'POST',
            headers: {
                Authorization: functions.checkStorage().token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(avatarFeatures),
        });
        const data = await response.json();
        if (response.ok) {

            functions.displayMsg("Saved", 'green');
            console.log('Saved:', data);
        }
    } catch (error) {
        console.error("Bad Input", error);
        functions.displayServerMsg();
        functions.connectionLost(error);
    }
};

export async function loggedInShowAvatar() {

    const loggedInId = sessionStorage.getItem("loggedInId");
    const loggedInEmail = sessionStorage.getItem("loggedInEmail");
    const loggedInName = sessionStorage.getItem("loggedInName");
    const loggedInPassword = sessionStorage.getItem("loggedInPassword");
    const avatarId = sessionStorage.getItem("avatarId");

    if (avatarId != null) {

        try {
            const response = await fetch(avatarUrl + "/" + avatarId, {
                method: 'GET',
                headers: {
                    'Authorization': functions.checkStorage().token,
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("haircolor", data.hairColor);
                localStorage.setItem("eyecolor", data.eyeColor);
                localStorage.setItem("skincolor", data.skinColor);
                localStorage.setItem("browtype", data.eyeBrowType);
                loadAvatarScene();

            } else {
                console.error(`Error: ${response.status} - ${data.error}`);
                functions.displayMsg(data.error, 'red')
            }

        } catch (error) {
            console.error('Error showing Avatar user:' + error);
            functions.displayServerMsg();
            functions.connectionLost(error);
        }
    }

    /*  if (loggedInId && loggedInEmail && loggedInName && loggedInPassword !== null) {
 
         myAccountBtn.style.display = "block";
         loginForms.style.display = 'none';
         main.loadScene();
         avatarStudioEvents.style.display = 'block';
         languageSelection.style.display = 'none';
     } else {
         return;
     }*/
}

function loadAvatarScene() {
    const myAccountBtn = document.getElementById("myAccountBtn");
    const languageSelection = document.getElementById("languageSelection");

    myAccountBtn.style.display = "block";
    loginForms.style.display = 'none';
    main.loadScene();
    avatarStudioEvents.style.display = 'block';
    languageSelection.style.display = 'none';
}


export async function deleteUser() {
    const deleteConfirm = confirm("Are you sure you want to delete the user?");
    const id = functions.checkStorage().loggedInId;
    const role = functions.checkStorage().loggedInRole;
    const selectedId = selectedUserId;

    if (deleteConfirm && id && (role !== "admin")) {
        try {
            const response = await fetch(url + "/" + id, {
                method: 'DELETE',
                headers: {
                    'Authorization': functions.checkStorage().token,
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Deleted user:', data);
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
            } else {
                console.error(`Error: ${response.status} - ${data.error}`);
                functions.displayMsg(data.error, 'red')
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    } else if (!deleteConfirm) {
        functions.displayMsg("delete canceled", 'orange');
    } else if (role === "admin") {
        try {
            const response = await fetch(url + "/" + selectedId, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Deleted user:', data);
                localStorage.clear();
            } else {
                console.error(`Error: ${response.status} - ${data.error}`);
                functions.displayMsg(data.error, 'red')
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            functions.displayServerMsg();
            functions.connectionLost(error);
        }
    }
    else {
        functions.displayMsg('Could not delete user', 'red');
        return;
    }
}