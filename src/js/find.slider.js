/**
 * Created by Shariar Shaikot on 1/9/17.
 */
import EventsSlider from './events.slider';
const singleton = Symbol();
const singletonEnforcer = Symbol();

export default class findElements {
  constructor(sym) {
    if (sym !== singletonEnforcer) throw new Error('Cannot construct singleton');
    this.attribute = 'data-mr-slider';
    this.defaultStart = 0;
    this.defaultRange = 100;
  }
  static get instance() {
    if (!this[singleton]) {
      this[singleton] = new findElements(singletonEnforcer);
    }
    return this[singleton];
  }

  /**
   * @returns {Array}
   */
  getSlidersByAttribute() {
    const nodeList = document.getElementsByTagName('*');
    const nodeArray = [];
    for ( let i = 0; nodeList.length > i; i++) {
      if (nodeList[i].hasAttribute(this.attribute)) {
        nodeArray.push(nodeList[i]);
      }
    }

    return nodeArray;
  }

  /**
   * @param id
   * @returns {*}
   */
  getSliderById(id) {
    const elem = document.getElementById(id);
    if (elem) {
      if (elem.hasAttribute(this.attribute)) {
        return elem;
      }
    }
    return null;
  }


  getSliderByContext(context) {
    if (context.hasAttribute(this.attribute)) {
      const events = new EventsSlider(context);
      return events.configObject(this);
    }
  }
}