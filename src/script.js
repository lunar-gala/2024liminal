import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { PMREMGenerator } from 'three/src/extras/PMREMGenerator.js';

import typefaceFont from 'three/examples/fonts/FREEDOM_Regular.json';

const panelUrls = {
    'About': 'https://example.com/about',
    'Tickets': 'https://example.com/tickets',
    'People': 'https://example.com/people',
    'Livestream': 'https://example.com/livestream'
};

const canvas = document.querySelector('canvas.webgl');

const scene = new THREE.Scene();


// Load HDR Environment Map
const rgbeLoader = new RGBELoader();
rgbeLoader.load('studio_small_04_8k.hdr', (texture) => {
    const pmremGenerator = new PMREMGenerator(renderer);
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    pmremGenerator.dispose();
    updateMaterial(envMap);
});


// Function to update material of cubes
function updateMaterial(envMap) {
    const material = new THREE.MeshStandardMaterial({
        ///color: 0x6699FF, // Glass color
        metalness: 0.9, // Reflectivity
        roughness: 0.1, // Sharpness of reflection
        envMap: envMap,
        opacity: 0.8,
        transparent: true,
        side: THREE.DoubleSide,
    });
 
    cubes.forEach(cube => {
        cube.material = material;
        cube.material.needsUpdate = true;
    });
}
 
const geometry = new THREE.BoxGeometry(5, 0.1, 5);
const numberOfCubes = 16;
const gapBetweenCubes = 1;
const cubes = [];
 
// Create cubes
for (let i = 0; i < numberOfCubes; i++) {
    const newCube = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
    newCube.position.set(0, i * gapBetweenCubes - gapBetweenCubes * numberOfCubes / 2, 0);
    newCube.name = `Cube-${i}`;
    scene.add(newCube);
    cubes.push(newCube);
}
 
// Font loading
const fontLoader = new FontLoader();
const font = fontLoader.parse(typefaceFont);
const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const textOptions = {
    font: font,
    size: 0.4,
    height: 0.02,
};

const texts = ['About', 'Tickets', 'People', 'Livestream'];

cubes.forEach((cube, index) => {
    const textGeometry = new TextGeometry(texts[index % texts.length], textOptions);
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    cube.userData.label = texts[index % texts.length]; // Assign label to cube's userData for reference
    textMesh.position.set(-2.3, 0.05, 2.4);
    textMesh.rotateX(-Math.PI / 2);
    cube.add(textMesh);
});

const width = 10;
const height = 10;
const intensity = 10;
const rectLight = new THREE.RectAreaLight(0xffffff, intensity, width, height);
rectLight.position.set(0, 0, -10);
rectLight.lookAt(0, 0, 0);
scene.add(rectLight);

const rectLightHelper = new RectAreaLightHelper(rectLight);
rectLight.add(rectLightHelper);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 5;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enableRotate = false;

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

let isZoomingIn = false;
let zoomStart = 5;
let zoomEnd = 2;
let zoomDuration = 2000; // 3 seconds in milliseconds
let zoomStartTime = -1;

window.addEventListener('mousedown', () => {
    isZoomingIn = true;
    zoomStart = camera.position.z;
    zoomEnd = 2;
    zoomStartTime = Date.now();
});

window.addEventListener('mouseup', () => {
    isZoomingIn = false;
    zoomStart = camera.position.z;
    zoomEnd = 5;
    zoomStartTime = Date.now();
});

const downwardSpeed = 0.005;
const cubeHeight = gapBetweenCubes * numberOfCubes;

const tick = () => {
    controls.update();

    const elapsedTime = Date.now() - zoomStartTime;
    const fraction = elapsedTime / zoomDuration;

    if (isZoomingIn && fraction < 1) {
        camera.position.z = zoomStart + (zoomEnd - zoomStart) * fraction;
    } else if (!isZoomingIn && fraction < 1) {
        camera.position.z = zoomStart + (zoomEnd - zoomStart) * fraction;
    } else if (isZoomingIn && fraction >= 1) {
        camera.position.z = zoomEnd;
        isZoomingIn = false;
        navigateToClosestPanel();
    } else if (!isZoomingIn) {
        camera.position.z = 5;
    }

    if (!isZoomingIn && camera.position.z === 5) {
        cubes.forEach((cube) => {
            cube.position.y -= downwardSpeed;
            if (cube.position.y < -cubeHeight / 2) {
                cube.position.y = (numberOfCubes - 1) * gapBetweenCubes - gapBetweenCubes * numberOfCubes / 2;
            }
        });
    }

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();

function navigateToClosestPanel() {
    let closestCube = null;
    let minDistance = Infinity;
    
    cubes.forEach(cube => {
        const distance = camera.position.distanceTo(cube.position);
        if (distance < minDistance) {
            minDistance = distance;
            closestCube = cube;
        }
    });
    console.log(closestCube.userData.label)
    if (closestCube && closestCube.userData.label && panelUrls[closestCube.userData.label]) {
        window.location.href = panelUrls[closestCube.userData.label];
    }
}