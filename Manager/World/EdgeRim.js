import { GUI } from 'dat.gui';
import * as THREE from 'three';
import gsap from 'gsap';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';

export default class EdgeRim {
  constructor(edge, group) {
    this.edge = edge;
    this.group = group;
    this.setUp();
  }

  setUp() {
    this.edge.visible = false;
    this.group.add(this.edge);
  }
}
