import * as THREE from 'three';
import gsap from 'gsap';
import ShaderInnerRim from '../../Manager/World/ShaderInnerRim';

export default class EdgeRim {
  constructor(edge, inner, group, color) {
    this.edge = edge;
    this.inner = inner;
    this.group = group;
    this.color = color;
    this.setUp();
    this.setInner();
  }

  setUp() {
    this.edge.material.transparent = true;
    this.edge.material.color = this.color;
    this.edge.material.depthWrite = false;
    this.edge.material.opacity = 0;
    this.edge.material.metalness = 0.97;
    this.edge.material.roughness = 0.1;

    this.group.add(this.edge);
  }

  setInner() {
    // this.inner.visible = false;
    this.inner.rotation.z = -0.95;
    this.texture = new THREE.CanvasTexture(this.generateTexture());

    this.uniforms = THREE.UniformsUtils.merge([
      { u_texture: { value: null } },
      { opacity: { value: 0 } },
      { progress: { value: 0.34 } },
    ]);

    this.materialGrad = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      ...ShaderInnerRim,
      transparent: true,
    });
    this.materialGrad.depthWrite = false;

    this.materialGrad.uniforms.u_texture.value = this.texture;

    this.inner.material = this.materialGrad;

    this.group.add(this.inner);
  }

  //TODO: merge this one with one in GradientCircle.js
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

  getTimeline() {
    this.timeline = gsap
      .timeline()
      .fromTo(
        this.materialGrad.uniforms.opacity,
        { value: 0 },
        { value: 1, duration: 0.1 }
      )
      // .set(this.materialGrad, { depthWrite: true })
      .to(
        this.materialGrad.uniforms.progress,
        { value: -0.2, duration: 1 },
        '<+=0.1'
      )
      .to(this.materialGrad.uniforms.opacity, { value: 0, duration: 1 })
      .fromTo(
        this.edge.material,
        { opacity: 0 },
        { opacity: 1, duration: 1 },
        '<'
      );

    return this.timeline;
  }
}
