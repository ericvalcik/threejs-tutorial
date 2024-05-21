import * as THREE from 'three'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let canvas = undefined;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(1, 0);

let pointerInCube = false;
let dragging = false;

function onPointerMove(event) {
	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

  if (dragging) {
    cube.rotateX(event.movementX / 50);
    cube.rotateY(event.movementY / 50);
  }
}

function mouseDown(event) {
  if (pointerInCube) {
    dragging = true;
  }
}

function mouseUp(event) {
  dragging = false;
}

const animate = () => {
  requestAnimationFrame(animate);

  // update the picking ray with the camera and pointer position
	raycaster.setFromCamera(pointer, camera);

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );

  pointerInCube = intersects.length > 0;
  cube.material.color.set(pointerInCube ? 0x00ff00 : 0xff0000);
  document.getElementsByTagName('canvas')[0].style.cursor = pointerInCube ? 'pointer' : 'default';

  renderer.render(scene, camera);
}

window.addEventListener('pointermove', onPointerMove);
window.addEventListener('mousedown', mouseDown);
window.addEventListener('mouseup', mouseUp);
animate();

