/**
 * Created by Shariar Shaikot on 1/9/17.
 */

import createElement from './create.slider';
import EventsSlider from './events.slider';

window.addEventListener('load', function () {
  (function (instance, window) {
    window.MrSlider = function (id, colorPalette) {
		this.colorPalette = colorPalette;
      this.slider = instance.findElement.getSliderById(id);
      if (!this.slider) this.slider = instance.createSliderById(id);
      /**
       * @type {EventsSlider}
       */
      try {
		    this.sliderEvents = new EventsSlider(this.slider, colorPalette);
		    this.sliderEvents.bindthumbmove();
        this.sliderEvents.bindmouseover();
        this.sliderEvents.bindmousemove();
	  } catch (e) {
		  //do nothing here
	  }
    };
    MrSlider.prototype.on = function (event, callabck) {
      const events = ['init', 'change', 'mouseover', 'mousemove', 'mouseout'];
      if (events.indexOf(event) > -1) {
        switch (event) {
          case 'init':
            if (typeof callabck !== 'function') throw new Error('oninit event expecting a callback');
            if (!this.isInitialized) {
              this.isInitialized = true;
              callabck(this.getSlider());
            }
            break;
          case 'change':
            if (typeof callabck !== 'function') throw new Error('onchange event expecting a callback');
            this.sliderEvents.customChangeCB.push(callabck);
            break;
          case 'mouseover':
            if (typeof callabck !== 'function') throw new Error('onmouseover event expecting a callback');
            this.sliderEvents.customEventCB.push(callabck);
            break;
          case 'mousemove':
            if (typeof callabck !== 'function') throw new Error('onmousemove event expecting a callback');
            this.sliderEvents.customMoveEventCB.push(callabck);
            break;
          case 'mouseout':
            if (typeof callabck !== 'function') throw new Error('onmouseout event expecting a callback');
            this.sliderEvents.bindmouseout(callabck);
            break;
        }
      } else {
        console.warn('No actual event found');
      }
    };
	MrSlider.prototype.getSlider = function() {
		return this.slider;
	},
	MrSlider.prototype.appendSlider = function (parent, done) {
		return instance.appendSlider(parent, this.slider, () => {
			this.sliderEvents = new EventsSlider(this.slider, this.colorPalette);
			this.sliderEvents.bindthumbmove();
      this.sliderEvents.bindmouseover();
      this.sliderEvents.bindmousemove();
			if (done) done();
		});
	}
    /**
     * @returns {number|*}
     */
    MrSlider.prototype.getValue = function () {
      return instance.findElement.getSliderByContext(this.slider, this.sliderEvents).fill;
    };
    /**
     * @param num
     */
    MrSlider.prototype.setValue = function (num) {
      instance.findElement.getSliderByContext(this.slider, this.sliderEvents).fill = Number(num);
    };
	
	MrSlider.prototype.setRange = function (num) {
      this.slider.setAttribute('data-range', num);
    };
    /**
     * @param colorPalette
     * @returns {*}
     */
    MrSlider.prototype.setColorPalette = function (colorPalette) {
      return this.sliderEvents.setColorPalette(colorPalette);
    };
    /**
     * @returns {*}
     */
    MrSlider.prototype.valueOf = function () {
      return this.slider;
    };

  })(createElement.instance, window);
})