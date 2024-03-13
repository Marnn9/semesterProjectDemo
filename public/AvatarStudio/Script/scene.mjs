"use strict";
import * as THREE from '../three.js-master/src/Three.js';
import * as dat from "../three.js-master/build/dat.gui.module.js";
import { GLTFLoader } from "../three.js-master/build/GLTFLoader.js";
import { TCharacter } from './Character.mjs';
import { TCharacterOptions } from "./characterOptions.js";

export const avatarFeatures = {
    skinColor: null,
    hairColor: null,
    eyeColor: null,
    browType: null,
    loggedInUser: null,
}

export function TinitialiseScene(anAvatar) {

    let scene, camera, renderer, modelMaterial, eyeMaterial, hairMaterial, skinMaterial;
    scene = new THREE.Scene();

    const guiWidth = 300;
    let centerX = window.innerWidth / 2 - (guiWidth/2); // Assuming each GUI panel has a width of 300px

    const guiPosition = { x: centerX, y: 10 }; // Adjust 'y' as needed
    //---------------gradient Background & color -----------------------

    let hexValue = "ffffff";
    const colorOfCube = "#" + hexValue;

    scene.background = new THREE.Color(0xC3D1C3);

    //----------------scene objects----------------------

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 10;
    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    scene.add(ambientLight);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.id = "sceneCanvas";

    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', windowResized);

    //-----------------character-------------------------
    const character = new TCharacter(scene);
    const characterOptions = new TCharacterOptions(scene)
    scene.add(character, characterOptions);
    //----------------localStorage--------------------------------------
    const localHairColor = localStorage.getItem("haircolor");
    const localEyeColor = localStorage.getItem("eyecolor");
    const localSkinColor = localStorage.getItem("skincolor");


    if (localHairColor !== null) {
        hairMaterial = new THREE.MeshBasicMaterial({ color: `#${localHairColor}` });
        avatarFeatures.hairColor = localHairColor;
    } else {
        hairMaterial = new THREE.MeshBasicMaterial({ color: colorOfCube });
    }
    if (localEyeColor !== null) {
        eyeMaterial = new THREE.MeshBasicMaterial({ color: `#${localEyeColor}` });
        avatarFeatures.eyeColor = localEyeColor;
    } else {
        eyeMaterial = new THREE.MeshBasicMaterial({ color: colorOfCube });
    }
    if (localSkinColor !== null) {
        skinMaterial = new THREE.MeshBasicMaterial({ color: `#${localSkinColor}` });
        avatarFeatures.skinColor = localSkinColor;
    } else {
        skinMaterial = new THREE.MeshBasicMaterial({ color: colorOfCube });
    }


    //-------------functions-------------------------------

    function guiControls() {
        const gui = new dat.GUI();

        gui.domElement.style.position = 'absolute';
        gui.domElement.style.left = guiPosition.x + 'px';
        gui.domElement.style.top = guiPosition.y + 'px';

        const eyeChanger = { color: eyeMaterial.color.getHex() };

        gui.addColor(eyeChanger, 'color').name('Eyecolor').onChange(function (color) {

            eyeMaterial.color.set(color);
            character.setIrisColor(color);

            avatarFeatures.eyeColor = eyeMaterial.color.getHex().toString(16);

            if (modelMaterial) {
                modelMaterial.color.set(color);
            }

        });

        const hairChanger = { color: hairMaterial.color.getHex() };

        gui.addColor(hairChanger, 'color').name('Haircolor').onChange(function (color) {
            hairMaterial.color.set(color);
            character.setHairColor(color);

            avatarFeatures.hairColor = hairMaterial.color.getHex().toString(16);

            if (modelMaterial) {
                modelMaterial.color.set(color);
            }
        });

        const skinChanger = { color: skinMaterial.color.getHex() };

        gui.addColor(skinChanger, 'color').name('Skincolor').onChange(function (color) {
            skinMaterial.color.set(color);
            character.setSkinColor(color);

            avatarFeatures.skinColor = skinMaterial.color.getHex().toString(16);

            if (modelMaterial) {
                modelMaterial.color.set(color);
            }
        });
    }

    guiControls();

    function render() {
        requestAnimationFrame(render);

        renderer.render(scene, camera);
    }

    function windowResized() {
        centerX = window.innerWidth / 2 - (guiWidth/2);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render();

}


