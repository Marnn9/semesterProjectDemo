"use strict"
import * as functions from "./functions.mjs"
import { avatarFeatures } from "../AvatarStudio/scriptAvatar/scene.mjs";
import { selectedUserId } from "./admin.mjs";

const url = 'user/users';
const avatarUrl = 'user/avatar';


export async function loginUser() {
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

            sessionStorage.setItem("loggedInId", data.user.id);
            sessionStorage.setItem("token", data.token);

            if (data.avatar !== null) {
                functions.avatarToStorageLogin(data);
                await loggedInShowAvatar();
            } else {
                functions.loadAvatarScene();
            }
            if (data.user.role === "admin") {
                sessionStorage.setItem("role", data.user.role);
                functions.showAdminFields();
            }

        } else {
            functions.responseNotOk(response, data);
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

    try {
        const response = await functions.globalFetch('POST', url, user);
        const data = await response.json();

        if (response.ok) {
            window.location.reload();
            console.log(data);
        } else {
            functions.responseNotOk(response, data);
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
    console.log(sessionStorage.getItem("token"));
    const userId = selectedUserId;

    const editedUser = { email, name, password, userId };
    try {
        const response = await functions.globalFetch('PUT', url + "/update", editedUser);
        const data = await response.json();
        if (response.ok) {
            console.log('Edited User:', data);
            functions.displayMsg("User updated", 'green');
            sessionStorage.setItem("token", data.token);

        } else {
            functions.responseNotOk(response, data);
        }
    } catch (error) {
        console.error('Error updating user:', error);
        functions.connectionLost(error);
        functions.displayServerMsg();
    }

}

export async function saveAvatar() {
    try {
        const response = await functions.globalFetch('POST', avatarUrl, avatarFeatures);
        const data = await response.json();
        if (response.ok) {
            functions.displayMsg("Saved", 'green');
            console.log("Saved:", data);

            if (data !== null) {
                functions.avatarToStorage(data);
            }
        } else {
            functions.responseNotOk(response, data);
        }
    } catch (error) {
        console.error("Bad Input", error);
        functions.displayServerMsg();
        functions.connectionLost(error);
    }
};

export async function loggedInShowAvatar() {
    if (functions.checkStorage().loggedInId) {
        try {
            const response = await functions.globalFetch('GET', avatarUrl);
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                functions.loadAvatarScene();
            } else {
                functions.responseNotOk(response, data);
            }
        } catch (error) {
            console.error('Error showing Avatar user:' + error);
            functions.displayServerMsg();
            functions.connectionLost(error);
        }
    }
}


export async function deleteUser() {
    const deleteConfirm = confirm("Are you sure you want to delete the user?");
    const id = functions.checkStorage().loggedInId;
    const role = functions.checkStorage().loggedInRole;
    const selectedId = selectedUserId;

    if (deleteConfirm && id && (role !== "admin")) {
        try {
            const response = await functions.globalFetch('DELETE', url + "/" + id);
            const data = await response.json();
            if (response.ok) {
                console.log('Deleted user:', data);
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
            } else {
                functions.responseNotOk(response, data);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    } else if (!deleteConfirm) {
        functions.displayMsg("delete canceled", 'orange');
    } else if (role === "admin") {
        try {
            const response = await functions.globalFetch('DELETE', url + "/" + selectedId);
            const data = await response.json();
            if (response.ok) {
                console.log('Deleted user:', data);
            } else {
                functions.responseNotOk(response, data);
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