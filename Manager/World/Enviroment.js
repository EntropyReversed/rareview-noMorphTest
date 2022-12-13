import * as THREE from 'three';
import Manager from '../Manager';
import gsap from 'gsap';
import { GUI } from 'dat.gui';

export default class Enviroment {
  constructor() {
    this.manager = new Manager();
    this.scene = this.manager.scene;

    this.setSunlight();
  }

  setSunlight() {
    this.sunLight = new THREE.DirectionalLight('#ffffff', 1);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 30;
    this.sunLight.shadow.mapSize.set(4096, 4096);
    this.sunLight.shadow.normalBias = 0.1;
    this.sunLight.shadow.bias = 0.001;
    // const helper = new THREE.CameraHelper(this.sunLight.shadow.camera);
    // this.scene.add(helper);
    this.sunLight.position.set(-1, 7, -5.5);
    this.scene.add(this.sunLight);

    this.spotLight = new THREE.SpotLight('#ffffff', 1.5);
    this.spotLight.position.set(-3, 3, 8);
    this.scene.add(this.spotLight);

    this.ambientlight = new THREE.AmbientLight('#ffffff', 1.2);
    this.scene.add(this.ambientlight);

    // const gui = new GUI();
    // const lightFolder = gui.addFolder('Light');

    // lightFolder.add(this.spotLight.position, 'x', -30, 30);
    // lightFolder.add(this.spotLight.position, 'y', -30, 30);
    // lightFolder.add(this.spotLight.position, 'z', -30, 30);
    // lightFolder.open();
  }
}
