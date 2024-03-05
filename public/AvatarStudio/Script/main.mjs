"use strict";
import { TinitialiseScene, avatarFeatures } from './scene.mjs';


export function loadScene() {
    TinitialiseScene();

}


export function addBrows() {
    console.log("browsAdded");
}


export function saveImage() {
    const saveConfirm = confirm("An image of the avatar will now be downloaded");

    if (saveConfirm) {
        // Wait for the next animation frame to ensure the rendering is complete
        requestAnimationFrame(() => {
            const canvas = document.getElementById('sceneCanvas');

            // Ensure the canvas is available
            if (!canvas) {
                console.error("Canvas not found");
                return;
            }

            // Logic for saving an image from the canvas
            const dataURL = canvas.toDataURL('image/png');

            const downloadLink = document.createElement('a');
            downloadLink.href = dataURL;
            downloadLink.download = 'myAvatar.png';

            downloadLink.click();
        });
    } else {
        return;
    }
}
/* const assets = {
    head: null,
    body: null,
    hairBtn: null,
    headBtn: null,
    clothesBtn: null,
}

function displayAvatar() {
    assets.head = new Tavatar.head(); // for when the time comes
} */

