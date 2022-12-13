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
    this.timeline = gsap.timeline();

    this.setCircleGrad();
    this.setUpTimeline();
  }

  setCircleGrad() {
    this.circle = new THREE.Mesh();

    this.texture = new THREE.CanvasTexture(this.generateTexture());
    this.geometry = new THREE.PlaneGeometry(4.3, 4.3);

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

    this.lettersTex = new THREE.CanvasTexture(this.generateTextureLetters());
    this.lettersTex.anisotropy =
      this.manager.renderer.renderer.capabilities.getMaxAnisotropy();

    this.materialGrad.uniforms.u_letters_texture.value = this.lettersTex;
    this.circle.geometry = this.geometry;
    this.circle.material = this.materialGrad;
    this.circle.position.z = 0.001;

    this.model.lettersTop.position.z = 0.002;
    this.model.modelGroup.add(this.circle);
  }

  setUpTimeline() {
    const c = new THREE.Color('rgb(0,0,0)');
    this.timeline

      .set(this.model.lettersTop.position, { z: 0.002 })

      .fromTo(
        this.circle.scale,
        // { x: 0.463, y: 0.463 },
        // { x: 0.463, y: 0.463, duration: 0.8 }

        { x: 0, y: 0 },
        { x: 3.1, y: 3.1, duration: 0.8 }
      )
      .set(this.lines.circleMain.circle.material, { opacity: 0 })

      .to(this.model.modelGroup.rotation, { x: -1, z: -0.7, duration: 1 })
      .to(this.model.modelGroup.position, { z: 4, duration: 0.8 }, '<')

      .to(this.circle.scale, { x: 1, y: 1 }, '<+0.3')

      .to(this.circle.material.uniforms.lettersV, {
        value: 1,
        duration: 0.05,
      })
      .set(this.model.circle.material, { metalness: 0.97 })
      .set(this.model.letters.material, { metalness: 0.97 })
      .set(this.model.lettersTop.material, {
        color: new THREE.Color('rgb(0,0,0)'),
      })
      .set(this.model.lettersTop.position, { z: 0 })

      .set(this.model.circle.material, { opacity: 1 })
      .set(this.model.letters.material, { opacity: 1 })
      .set(this.model.lettersTop.material, { opacity: 1 })

      .to(
        this.circle.material.uniforms.progress,
        {
          value: 1.1,
          duration: 0.5,
          ease: 'power3.out',
        },
        '<'
      )
      .to(
        this.model.lettersTop.material,
        { metalness: 0.97, duration: 0.15 },
        '<'
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
      .to(this.model.letters.position, { z: -0.1, duration: 0.2 }, '<+=0.1')

      .to(this.model.lettersTop.position, { z: 0.13 });
  }

  generateTexture() {
    const size = 1024;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;
    ctx.rect(0, 0, size, size);

    const gradient = ctx.createLinearGradient(size / 2, 0, size / 2, size);
    gradient.addColorStop(0, '#a59bf4');
    gradient.addColorStop(1, '#f2a0ac');
    ctx.fillStyle = gradient;
    ctx.fill();

    return canvas;
  }

  generateTextureLetters() {
    const size = 1024;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const scaleR = 1.686;
    const scaleV = 1.687;
    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = 'black';
    ctx.rect(0, 0, size, size);
    ctx.fill();

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.save();
    var path = new Path2D(
      'M141.869,55.953C141.869,55.953 128.131,7.141 128.135,7.092C127.644,7.01 33.151,-7.164 7.778,84.888C6.68,88.854 6.175,92.961 6.281,97.074C6.306,126.76 6.442,253.022 6.442,253.022L56.985,253.114C56.985,253.114 57.034,106.642 57.034,106.6C57.034,106.6 57.034,106.6 57.034,106.6C57.033,106.475 56.68,46.314 141.869,55.953Z'
    );
    ctx.translate(238, 310);
    ctx.scale(scaleR, scaleR);
    ctx.stroke(path);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    var path2 = new Path2D(
      'M6.261,6.374L58.787,6.37L108.943,182.21L157.887,6.261L209.294,6.371L141.601,235.429C141.601,235.429 133.913,255.488 108.65,255.272C80.912,255.035 74.056,231.984 74.057,231.984C74.058,231.985 6.261,6.374 6.261,6.374Z'
    );
    ctx.translate(468, 307.8);
    ctx.scale(scaleV, scaleV);
    ctx.stroke(path2);
    ctx.restore();

    return canvas;
  }

  updateTime() {
    this.materialGrad.uniforms.u_time.value = this.clock.getElapsedTime();
  }
}
