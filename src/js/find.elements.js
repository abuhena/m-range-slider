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
      const that = this;
      return {
        set fill (range) {
          let startFrom = parseInt(context.getAttribute('data-start'));
          let rangeEnd = parseInt(context.getAttribute('data-range'));
          startFrom = !startFrom ? that.defaultStart : startFrom;
          rangeEnd = !rangeEnd ? that.defaultRange : rangeEnd;
          if (range >= startFrom && range <= rangeEnd) {
            context.childNodes[0].childNodes[0].style.width = `${(context.clientWidth / rangeEnd) * range}px`;
            context.setAttribute('data-fill', range);
            return true;
          }
          return false;
        },
        get fill () {
          let rangeEnd = parseFloat(context.getAttribute('data-range'));
          rangeEnd = (rangeEnd || rangeEnd !== 0) || this.defaultRange;
          const currentFill = ((context.childNodes[0].childNodes[0].clientWidth * rangeEnd)
           / context.clientWidth);
          if (parseFloat(context.getAttribute('data-fill')) === currentFill) {
            return currentFill;
          }
        }
      }
    }
  }
}