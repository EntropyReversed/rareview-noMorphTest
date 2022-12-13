import Manager from '../Manager';
import Model from './Model';
import Enviroment from './Enviroment';
import Text from './Text';
import TriggerScroll from '../Utils/TriggerScroll';
import Textures from './Textures';

export default class World {
  constructor() {
    this.manager = new Manager();
    this.masterTimeline = this.manager.masterTimeline;
    this.resources = this.manager.resources;
    this.text = new Text();
    this.camera = this.manager.camera;
    this.enviroment = new Enviroment();
    this.textures = new Textures();
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    }

    this.resources.on('ready', () => {
      this.model = new Model();
      this.setUpTimeline();
    });
  }

  setUpTimeline() {
    const linesTimeline = this.model.lines.getTimeline();
    const linesReverse = this.model.lines.getTimelineReverse();
    const title1 = this.text.getTimeline();
    const modelTimeline1 = this.model.timeline;
    const modelTimeline2 = this.model.timeline2;
    // const modelTimeline3 = this.model.timeline3;
    const cameraTimeline = this.camera.getTimeline();
    const gradientTimeline = this.model.gradientCircle.timeline;
    const modelLinesTimeline = this.model.modelLines.getTimeline();
    const edgeTimeline = this.model.edgeRim.getTimeline();
    const cameraTimeline2 = this.camera.getTimeline2();

    this.masterTimeline
      .add(modelTimeline1)
      .add(title1, '<+0.1')
      .add(linesTimeline, '-=0.35')
      .add(modelTimeline2, '-=1')
      .add(linesReverse, '-=0.3')
      .add(gradientTimeline, '-=0.1')
      // .add(modelTimeline3);
      .add(cameraTimeline)
      .add(modelLinesTimeline, '<')
      .add(edgeTimeline, '-=1.5')
      .add(cameraTimeline2, '-=1.7');

    this.scrollTrigger = new TriggerScroll();
  }
}
