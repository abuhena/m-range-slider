/**
 * Created by Shariar Shaikot on 1/9/17.
 */
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
    let iterator = 0;
    let node = null;

    while (node = nodeList[iterator++]) {
      if (node.hasAttribute(this.attribute)) nodeArray.push(node);
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
      return {
        set fill (range) {
          let startFrom = parseInt(context.getAttribute('data-start'));
          let rangeEnd = parseInt(context.getAttribute('data-range'));
          startFrom = (startFrom || startFrom !== 0) || this.defaultStart;
          rangeEnd = (rangeEnd || rangeEnd !== 0) || this.defaultRange;
          if (range >= startFrom && range <= rangeEnd) {
            context.firstChild.parentElement.style.width = `${(context.clientWidth / rangeEnd) * range}px`;
            context.setAttribute('data-fill', range);
            return true;
          }
          return false;
        },
        get fill () {
          let rangeEnd = parseFloat(context.getAttribute('data-range'));
          rangeEnd = (rangeEnd || rangeEnd !== 0) || this.defaultRange;
          const currentFill = ((context.firstChild.parentElement.clientWidth * rangeEnd)
           / context.clientWidth);
          if (parseFloat(context.getAttribute('data-fill')) === currentFill) {
            return currentFill;
          }
        }
      }
    }
  }
}