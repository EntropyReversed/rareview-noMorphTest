import gsap from 'gsap';
import Manager from '../Manager';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

export default class Text {
  constructor() {
    this.manager = new Manager();
    // this.text = this.manager.parent.querySelector(selector);
    this.timeline = gsap.timeline();
    this.splitText('.firstTitle .top');
    this.splitText('.firstTitle .btm');
  }

  getTimeline() {
    return this.timeline
      .fromTo(
        '.firstTitle .letter',
        { opacity: 0 },
        {
          duration: 0.1,
          opacity: 1,
          stagger: 0.012,
        }
      )
      .to(
        '.firstTitle',
        {
          opacity: 0,
          duration: 0.1,
        },
        '+=0.1'
      );
  }

  splitText(selector) {
    const node = this.manager.parent.querySelector(selector);
    node.innerHTML = node.innerText
      .split(/\s/)
      .map((word) => {
        return `<span class="word">${word}</span>`;
      })
      .join('\xa0');

    node.querySelectorAll('.word').forEach((word) => {
      word.innerHTML = word.innerText
        .split('')
        .map((letter) => {
          return `<span class="letter">${letter}</span>`;
        })
        .join(' ');
    });
  }
}
