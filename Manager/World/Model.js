import { Color, Group, MeshStandardMaterial } from 'three';
import gsap from 'gsap';
import Manager from '../Manager';
import GradientCircle from './GradientCircle';
import LinesAnimation from './LinesAnimation';
import ModelLines from '../../Manager/World/ModelLines';
import EdgeRim from '../../Manager/World/EdgeRim';
// import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';

export default class Model {
  constructor() {
    this.manager = new Manager();
    this.scene = this.manager.scene;
    this.resources = this.manager.resources;
    this.model = this.resources.items.model;
    this.mainColor = new Color('rgb(200,200,200)');

    this.setModel();

    this.lines = new LinesAnimation(this.scene);
    this.gradientCircle = new GradientCircle(this.lines, this);

    this.createTimeline();

    // window.scrollTo(0, 0);
  }

  setModel() {
    this.rimRingGroup = new Group();
    this.modelGroup = new Group();

    this.model.scene.traverse((child) => {
      console.log(child);
      if (child.name === 'Circle') {
        this.circle = child;
        this.setModelPart(child, 1, true);
      }
      if (child.name === 'LettersFill') {
        this.letters = child;
        this.setModelPart(child);
      }
      if (child.name === 'Letters') {
        this.lettersTop = child;
        this.setModelPart(child);
      }
      if (child.name === 'ring') {
        this.mLines = child;
      }
      if (child.name === 'rim') {
        this.edge = child;
      }
      if (child.name === 'rimInner') {
        this.edgeInner = child;
      }
    });

    this.modelLines = new ModelLines(this.mLines, this.rimRingGroup);
    this.edgeRim = new EdgeRim(
      this.edge,
      this.edgeInner,
      this.rimRingGroup,
      this.mainColor
    );

    this.modelGroup.add(this.circle);
    this.modelGroup.add(this.letters);
    this.modelGroup.add(this.lettersTop);
    // this.modelGroup.scale.set(0.47, 0.47, 0.47);

    // this.rimRingGroup.scale.set(0.47, 0.47, 0.47);
    this.modelGroup.add(this.rimRingGroup);

    this.scene.add(this.modelGroup);
  }

  setModelPart(part, startOp = 0, shade = false) {
    // part.layers.enable(0);

    part.material = new MeshStandardMaterial();

    // part.geometry.computeTangents();
    // part.geometry.computeVertexNormals();
    // part.geometry.verticesNeedUpdate = true;
    // part.geometry.normalsNeedUpdate = true;

    part.material.transparent = true;
    part.material.color = this.mainColor;

    part.material.opacity = startOp;
    part.material.metalness = 0;
    part.material.roughness = 0.1;
    // part.material.depthWrite = false;
    // part.material.wireframe = true;
    part.material.flatShading = shade;
    // part.material.vertexColors = true;
    part.material.needsUpdate = true;

    part.receiveShadow = true;
    part.castShadow = true;
  }

  createTimeline() {
    this.timeline = gsap
      .timeline()

      .to(this.circle.material, { opacity: 0.3 })
      .to(this.modelGroup.scale, { x: 0.8, y: 0.8, duration: 0.8 }, '<')
      .to(this.modelGroup.scale, { x: 1.2, y: 1.2, duration: 0.2 })
      .to(this.circle.material, { opacity: 1 }, '<')
      .to(this.modelGroup.rotation, { z: 0.6, duration: 0.4 }, '<')
      .to(
        this.modelGroup.position,
        { z: 12, x: -0.5, duration: 0.2, ease: 'power3.in' },
        '<'
      );

    this.timeline2 = gsap
      .timeline()
      .set(this.circle.material, { opacity: 0 })
      .set(this.modelGroup.rotation, { z: 0 })
      .set(this.modelGroup.position, { x: 0.3, y: 0.08 })
      .set(this.lettersTop.material, { opacity: 1 })
      .to(this.modelGroup.scale, { x: 1.2, y: 1.2, duration: 0.2 })
      .to(
        this.modelGroup.position,
        { x: 0, z: 0.5, duration: 0.4, ease: 'power3.out' },
        '<+0.2'
      )
      .to(this.lettersTop.material, { opacity: 0.3 })
      .fromTo(
        '.secondTitle',
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: 'power3.out' },
        '<'
      )
      .fromTo(
        '.secondTitle',
        { scale: 10 },
        { scale: 1, duration: 0.2, ease: 'power3.out' },
        '<'
      )
      .to('.secondTitle', { opacity: 0 }, '<+0.5')
      .to(this.lettersTop.material, { opacity: 1 }, '<+0.2');
  }
}
