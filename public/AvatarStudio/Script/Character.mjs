"use strict"
import { GLTFLoader } from "../three.js-master/build/GLTFLoader.js";
import * as THREE from '../three.js-master/src/Three.js';

export class TCharacter extends THREE.Object3D {
    constructor(scene) {
        super(); //class constructor

        const loader = new GLTFLoader();
        const localHairColor = localStorage.getItem("haircolor");
        const localEyeColor = localStorage.getItem("eyecolor");
        const localSkinColor = localStorage.getItem("skincolor");




        loader.load("AvatarStudio/Media/Boy-smaller-file.gltf", (gltfModel) => {
            //this.irisOfEye = gltfModel.scene.children[2].material;
            gltfModel.scene.position.set(0, 0, 0);
            //gltfModel.scene.rotation.y = -Math.PI / 2;
            this.add(gltfModel.scene);

            const lights = gltfModel.scene.children.filter(child => child.isLight);

            const eyebrows = gltfModel.scene.children.find(child => child.name === 'eyebrow')
            if (eyebrows) {
                // Remove the eyebrows from their parent
                gltfModel.scene.remove(eyebrows);
            }
            // Set the intensity of each light
            lights.forEach(light => {

                light.intensity = 1;
            });
            const eyeMaterial = gltfModel.scene.children.find(child => child.name === 'eye_left')
            console.log(eyeMaterial)

            // Define setIrisColor as a method of the class
            this.setIrisColor = function (aColor) {
                eyeMaterial.children[2].material.color.set(aColor);  // Set a default color for testing
            };
            const hairMaterial = gltfModel.scene.children.find(child => child.name === 'hair_joined')
            console.log(hairMaterial)
            this.setHairColor = function (aColor) {
                hairMaterial.material.color.set(aColor);  // Set a default color for testing
            };

            const skinMaterial = gltfModel.scene.children.find(child => child.name === 'BSurfaceMesh002')
            const earMaterial = gltfModel.scene.children.find(child => child.name === 'EARS')
            console.log(skinMaterial)

            // Define setIrisColor as a method of the class
            this.setSkinColor = function (aColor) {
                skinMaterial.material.color.set(aColor);
                earMaterial.material.color.set(aColor)
            };

            this.setColor = function () {
                skinMaterial.material.color.set("#" + localSkinColor);
                earMaterial.material.color.set("#" + localSkinColor);
                eyeMaterial.children[2].material.color.set("#" + localEyeColor);
                hairMaterial.material.color.set("#" + localHairColor);

            }
            if ((localEyeColor && localHairColor && localSkinColor) !== null) {
                this.setColor();
            }
        });



    }
}