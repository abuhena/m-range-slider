/**
 * Created by Shariar Shaikot on 1/9/17.
 */

import findElements from './find.slider';

const singleton = Symbol();
const singletonEnforcer = Symbol();

export default class createElements {
  constructor(sym) {
    if (sym !== singletonEnforcer) throw new Error('Cannot construct singleton');
    this.findElement = findElements.instance;
    this.findElement.getSlidersByAttribute().forEach(each => {
      this.createCustom(each);
    });
  }

  static get instance() {
    if (!this[singleton]) {
      this[singleton] = new createElements(singletonEnforcer);
    }
    return this[singleton];
  }
  
  createSliderById(id) {
	const emptyElem = document.createElement('div');
	emptyElem.setAttribute('id', id);
	emptyElem.setAttribute('data-mr-slider', '');
	emptyElem.setAttribute('data-start', '0');
	emptyElem.setAttribute('data-range', '100');
	return emptyElem;
  }
  
  appendSlider(parentEl, slider, cb) {
	const observer = new MutationObserver((mutations) => {
		this.createCustom(slider);
		return cb();
	});
	observer.observe(parentEl, { childList: true });
	parentEl.appendChild(slider);
  }

  /**
   * @param hex
   * @returns {*[]}
   */
  static hexToRGB(hex) {
    if (hex.length > 7) throw new Error('Unable to convert hex to RGB');
    const hexString = hex.toString().substr(1, 6);
    return [
      parseInt(hexString.substr(0, 2), 16),
      parseInt(hexString.substr(2, 2), 16),
      parseInt(hexString.substr(4, 2), 16)
    ];
  }

  /**
   * @param elem
   */
  createCustom(elem) {
    let startFrom = parseInt(elem.getAttribute('data-start'));
    let rangeEnd = parseInt(elem.getAttribute('data-range'));
    startFrom = (startFrom || startFrom !== 0) ? this.findElement.defaultStart : startFrom;
    rangeEnd = (rangeEnd || rangeEnd !== 0) ? this.findElement.defaultRange : rangeEnd;
    const body = document.createElement('div');
    body.className = 'mr-slider';
    
    const fill = document.createElement('div');
    fill.className = 'fill';
    const fillChild = document.createElement('div');
    fillChild.className = 'fill-child';
    if (elem.hasAttribute('data-fill-color') && elem.getAttribute('data-fill-color').length < 8
      && elem.getAttribute('data-fill-color').length > 6) {
      let fillBGColor = createElements.hexToRGB(elem.getAttribute('data-fill-color'));
      fillBGColor = `rgb(${fillBGColor[0]}, ${fillBGColor[1]}, ${fillBGColor[2]})`;
      fillChild.style.backgroundColor = fillBGColor;
    }
    fill.appendChild(fillChild);
    
    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    if (elem.hasAttribute('data-thumb-color') && elem.getAttribute('data-thumb-color').length < 8
      && elem.getAttribute('data-thumb-color').length > 6) {
      let thumbBGColor = createElements.hexToRGB(elem.getAttribute('data-thumb-color'));
      thumbBGColor = `rgb(${thumbBGColor[0]}, ${thumbBGColor[1]}, ${thumbBGColor[2]})`;
      thumb.style.borderColor = thumbBGColor;
    }
    
    const toFill = document.createElement('div');
    toFill.className = 'unfilled';
    const toFillChild = document.createElement('div');
    toFillChild.className = 'unfill-child';
    if (elem.hasAttribute('data-body-color') && elem.getAttribute('data-body-color').length < 8
      && elem.getAttribute('data-body-color').length > 6) {
      let bodyBGColor = createElements.hexToRGB(elem.getAttribute('data-body-color'));
      bodyBGColor = `rgba(${bodyBGColor[0]}, ${bodyBGColor[1]}, ${bodyBGColor[2]}, 0.9)`;
      toFillChild.style.backgroundColor = bodyBGColor;
    }
    toFill.appendChild(toFillChild);
    
    body.appendChild(fill);
    body.appendChild(thumb);
    body.appendChild(toFill);
    elem.appendChild(body);
    const slider = this.findElement.getSliderByContext(elem);
    slider.fill = startFrom;
  }
}