"use strict"
import { GLTFLoader } from "../three.js-master/build/GLTFLoader.js";
import * as THREE from '../three.js-master/src/Three.js';
import { avatarFeatures } from "./scene.mjs";

export class TCharacterOptions extends THREE.Object3D {
    constructor(scene) {
        super();

        const loader = new GLTFLoader();
        let activeEyebrow = null;
        let activeType = null;

        const loadEyebrowsButton = document.getElementById('loadEyebrowsButton');

        loadEyebrowsButton.addEventListener('click', () => {

            if (activeEyebrow) {
                this.remove(activeEyebrow);
            }

            loader.load("AvatarStudio/Media/eyebrows.gltf", (gltfModel) => {
                gltfModel.scene.position.set(0, 0, 0);
                activeType = 1;
                avatarFeatures.browType = activeType;
                this.add(gltfModel.scene);
                activeEyebrow = gltfModel.scene;

            });
        });

        const loadEyebrows2Button = document.getElementById('loadEyebrows2Button');

        loadEyebrows2Button.addEventListener('click', () => {
            loader.load("AvatarStudio/Media/eyebrows-1.gltf", (gltfModel) => {

                if (activeEyebrow) {
                    this.remove(activeEyebrow);
                }

                gltfModel.scene.position.set(0, 0, 0);
                activeType = 2;
                avatarFeatures.browType = activeType;
                this.add(gltfModel.scene);
                activeEyebrow = gltfModel.scene;
            });
        });



    }
}
