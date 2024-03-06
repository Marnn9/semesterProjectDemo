"use strict"
import * as functions from "./clientFunctions.mjs"

const loginForm = document.getElementById('login');
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            functions.loginUser();
        });