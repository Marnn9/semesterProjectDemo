"use strict"
import * as requests from "./clientRequests.mjs"

const loginForm = document.getElementById('login');
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            requests.loginUser();
        });