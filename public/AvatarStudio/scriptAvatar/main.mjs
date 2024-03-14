"use strict";
import { TinitialiseScene } from './scene.mjs';

export function loadScene() {
    TinitialiseScene();

}

export function saveImage() {
    const saveConfirm = confirm("An image of the avatar will now be downloaded");

    if (saveConfirm) {
        requestAnimationFrame(() => {
            const canvas = document.getElementById('sceneCanvas');

            if (!canvas) {
                console.error("Canvas not found");
                return;
            }
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

