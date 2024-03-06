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

