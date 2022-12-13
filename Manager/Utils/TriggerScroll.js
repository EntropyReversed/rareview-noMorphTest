import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Manager from '../Manager';

export default class TriggerScroll {
  constructor() {
    this.manager = new Manager();
    gsap.registerPlugin(ScrollTrigger);
    this.createTrigger();
  }

  createTrigger() {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: '.scene-wrap',
          start: 'top top',
          scrub: 2,
          // immediateRender: false,
          // invalidateOnRefresh: true,
          // end: "+=1200%",
          // pin: true,
          end: 'bottom bottom',
        },
      })
      .add(this.manager.masterTimeline);
  }
}
