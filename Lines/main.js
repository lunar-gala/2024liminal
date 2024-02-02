import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const path_geometry = new THREE.PlaneGeometry(3.1525, 200);
const path_material = new THREE.MeshMatcapMaterial({color:0xffffff});
const path = new THREE.Mesh(path_geometry, path_material);
scene.add(path);
path.rotation.x = - (Math.PI / 2)
path.position.y = -1.5
path.position.z = 2

const plane_geometry_1_right = new THREE.PlaneGeometry(3, 2);
const plane_material_1_right = new THREE.MeshMatcapMaterial({color: 0xff0000});
plane_material_1_right.transparent = true
plane_material_1_right.opacity = 0.8
const plane1_right = new THREE.Mesh(plane_geometry_1_right, plane_material_1_right);
scene.add(plane1_right);
plane1_right.position.z = 1
plane1_right.position.x = 2.5
plane1_right.rotation.y = -0.3

const plane_geometry_1_left = new THREE.PlaneGeometry(3, 2);
const plane_material_1_left = new THREE.MeshMatcapMaterial({color: 0xff0000});
plane_material_1_left.transparent = true
plane_material_1_left.opacity = 0.8
const plane1_left = new THREE.Mesh(plane_geometry_1_left, plane_material_1_left);
scene.add(plane1_left);
plane1_left.position.z = 1
plane1_left.position.x = -2.5
plane1_left.rotation.y = 0.3

const plane_geometry_2_right = new THREE.PlaneGeometry(3, 2);
const plane_material_2_right = new THREE.MeshMatcapMaterial({color: 0x00ff00});
plane_material_2_right.transparent = true
plane_material_2_right.opacity = 0.8
const plane2_right = new THREE.Mesh(plane_geometry_2_right, plane_material_2_right);
scene.add(plane2_right);
plane2_right.position.z = -3
plane2_right.position.x = 2.5
plane2_right.rotation.y = -0.3

const plane_geometry_2_left = new THREE.PlaneGeometry(3, 2);
const plane_material_2_left = new THREE.MeshMatcapMaterial({color: 0x00ff00});
plane_material_2_left.transparent = true
plane_material_2_left.opacity = 0.8
const plane2_left = new THREE.Mesh(plane_geometry_2_left, plane_material_2_left);
scene.add(plane2_left);
plane2_left.position.z = -3
plane2_left.position.x = -2.5
plane2_left.rotation.y = 0.3

const plane_geometry_3_right = new THREE.PlaneGeometry(3, 2);
const plane_material_3_right = new THREE.MeshMatcapMaterial({color: 0x0000ff});
plane_material_3_right.transparent = true
plane_material_3_right.opacity = 0.8
const plane3_right = new THREE.Mesh(plane_geometry_3_right, plane_material_3_right);
scene.add(plane3_right);
plane3_right.position.z = -7
plane3_right.position.x = 2.5
plane3_right.rotation.y = -0.3

const plane_geometry_3_left = new THREE.PlaneGeometry(3, 2);
const plane_material_3_left = new THREE.MeshMatcapMaterial({color: 0x0000ff});
plane_material_3_left.transparent = true
plane_material_3_left.opacity = 0.8
const plane3_left = new THREE.Mesh(plane_geometry_3_left, plane_material_3_left);
scene.add(plane3_left);
plane3_left.position.z = -7
plane3_left.position.x = -2.5
plane3_left.rotation.y = 0.3

camera.position.z = 5

function moveRightForward(plane){
	if (plane.position.z >= 5){
		plane.position.z = -59
	}
	plane.position.z += 0.1
}

function moveLeftForward(plane){
	if (plane.position.z >= 5){
		plane.position.z = -59
	}
	plane.position.z += 0.1
}

function move(){
	moveRightForward(plane1_right)
	moveLeftForward(plane1_left)
	moveRightForward(plane2_right)
	moveLeftForward(plane2_left)
	moveRightForward(plane3_right)
	moveLeftForward(plane3_left)
}

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

let moveInterval;

document.addEventListener('DOMContentLoaded', (event) => {
    // const rectangle = document.querySelector('.rectangle');
    const area = document.querySelector('area'); // Assuming there's only one <area>

    const startMove = () => {
        if (!moveInterval) {
            moveInterval = setInterval(move, 10);
        }
    };

    const stopMove = () => {
        if (moveInterval) {
            clearInterval(moveInterval);
            moveInterval = null;
        }
    };

    // rectangle.addEventListener('mouseover', startMove);
    // rectangle.addEventListener('mouseout', stopMove);

    // Add event listeners to the <area>
    area.addEventListener('mouseover', startMove);
    area.addEventListener('mouseout', stopMove);
});

animate();