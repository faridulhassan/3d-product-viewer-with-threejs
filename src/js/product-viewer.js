import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default function ProductViewer(el = "#app") {
  // container
  const container = document.querySelector(el);
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  const scene = new THREE.Scene();
  // create a camera, which defines where we're looking at
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  // tell the camera where to look
  camera.position.set(0, 0, 10);

  /**
   * Lights
   */
  const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
  directionalLight.position.set(1, 1, 0);
  scene.add(directionalLight);

  // create a render and set the size
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const renderer = new THREE.WebGLRenderer({
    // alpha: true,
    antialias: true,
  });
  renderer.setSize(sizes.width, sizes.height);

  //   Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.maxDistance = 20;
  controls.minDistance = 2;

  //   Light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Mesh
  /* const geometry = new THREE.ConeGeometry(2, 3, 5);
  const material = new THREE.MeshBasicMaterial({
    wireframe: true,
  });

  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh); */

  //   Model
  const loader = new GLTFLoader();
  let model;
  loader.load(
    "/models/egg-chair/scene.gltf",
    function (gltf) {
      const scaleSize = 6;
      model = gltf.scene;
      model.scale.set(scaleSize, scaleSize, scaleSize);
      model.position.set(0, -2, 0);
      model.traverse(function (element) {
        if (element.isMesh) {
          const color = new THREE.Color("gray");
          element.material.color.r = color.r;
          element.material.color.g = color.g;
          element.material.color.b = color.b;
          console.log(element);
        }
      });
      scene.add(model);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    }
  );
  // add the output of the render function to the HTML
  container.appendChild(renderer.domElement);
  // Clock
  const clock = new THREE.Clock();
  // function for re-rendering/animating the scene
  function tick() {
    requestAnimationFrame(tick);
    model.rotation.y += 0.01;
    controls.update();
    renderer.render(scene, camera);
  }
  tick();

  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}
