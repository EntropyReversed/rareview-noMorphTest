import * as THREE from 'three';
import Manager from '../Manager';
import Shader from './Shader';
import gsap from 'gsap';
import { GUI } from 'dat.gui';

export default class GradientCircle {
  constructor(lines, model) {
    this.lines = lines;
    this.manager = new Manager();
    this.camera = this.manager.camera.perspectiveCamera;
    this.scene = this.manager.scene;
    this.model = model;
    this.masterTimeline = this.manager.masterTimeline;
    this.texture = this.manager.world.textures.gradientTexture;
    this.lettersTex = this.manager.world.textures.lettersTexture;
    this.timeline = gsap.timeline();
    this.setCircleGrad();
    this.setUpTimeline();
  }

  setCircleGrad() {
    this.circle = new THREE.Mesh();
    this.geometry = new THREE.PlaneGeometry(4.25, 4.25);

    this.clock = new THREE.Clock();

    this.uniforms = THREE.UniformsUtils.merge([
      { u_texture: { value: null } },
      { u_letters_texture: { value: null } },
      { u_time: { value: this.clock.getElapsedTime() } },
      { lettersV: { value: 0 } },

      { progress: { value: -0.1 } },
    ]);

    this.materialGrad = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      ...Shader,
      // lights: true,
      transparent: true,
    });
    this.materialGrad.depthWrite = false;

    // THREE.UniformsUtils.merge() calls THREE.clone() on each uniform.
    // Texture needs to be assigned here so it's not cloned
    this.materialGrad.uniforms.u_texture.value = this.texture;

    this.lettersTex.anisotropy =
      this.manager.renderer.renderer.capabilities.getMaxAnisotropy();

    this.materialGrad.uniforms.u_letters_texture.value = this.lettersTex;
    this.circle.geometry = this.geometry;
    this.circle.material = this.materialGrad;
    this.circle.position.z = 0.001;

    this.model.lettersTop.position.z = 0.0012;
    this.model.modelGroup.add(this.circle);
  }

  setUpTimeline() {
    const c = new THREE.Color('rgb(0,0,0)');
    this.timeline
      .set(this.model.lettersTop.position, { z: 0.0012 })
      .fromTo(
        this.circle.scale,
        { x: 0, y: 0 },
        { x: 3.1, y: 3.1, duration: 0.8 }
      )
      .set(this.lines.circleMain.circle.material, { opacity: 0 })

      .to(this.model.modelGroup.rotation, { x: -1, z: -0.7, duration: 1 })
      .to(this.model.modelGroup.position, { z: 4, duration: 0.8 }, '<')
      // .to(this.manager.camera.perspectiveCamera.rotation, {x: 0.94, y: 0.68, z: 0.46})
      // .to(this.manager.camera.perspectiveCamera.position, {x: 5, y: -5, z: 4.6}, "<")

      .to(this.circle.scale, { x: 1, y: 1 }, '<+0.3')

      .to(this.circle.material.uniforms.lettersV, {
        value: 1,
        duration: 0.05,
      })
      .set(this.model.circle.material, { metalness: 0.97 })
      .set(this.model.letters.material, { metalness: 0.97 })
      .set(this.model.lettersTop.material, {
        color: c,
      })
      .set(this.model.lettersTop.position, { z: 0 })

      .set(this.model.circle.material, { opacity: 1 })
      .set(this.model.letters.material, { opacity: 1 })
      .set(this.model.lettersTop.material, { opacity: 1 })

      .to(
        this.circle.material.uniforms.progress,
        {
          value: 1.1,
          duration: 0.8,
          ease: 'power3.out',
        },
        '<'
      )
      .to(
        this.model.lettersTop.material,
        { metalness: 0.97, duration: 0.15 },
        '<+=0.1'
      )
      .to(
        c,
        {
          r: 200 / 255,
          g: 200 / 255,
          b: 200 / 255,
          duration: 0.15,
          onUpdate: () => {
            this.model.lettersTop.material.color = c;
          },
        },
        '<+=0.1'
      )
      .to(this.model.letters.position, { z: -0.2, duration: 0.1 }, '<+=0.2')

      .to(this.model.lettersTop.position, { z: 0.2, duration: 0.2 })
      .to(this.model.lettersTop.scale, { z: 1.9, duration: 0.2 }, '<');
  }

  updateTime() {
    this.materialGrad.uniforms.u_time.value = this.clock.getElapsedTime();
  }
}
