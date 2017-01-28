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
	  } catch (e) {
		  //do nothing here
	  }
    };
    /**
     * @returns {{onchange, onmouseover, oninit}}
     */
    MrSlider.prototype.events = function() {
      var that = this;
      return {
        /**
         * @param val
         */
        set onchange(val) {
          if (typeof val !== 'function') throw new Error('onmouseover event expecting a callback');
            that.sliderEvents.bindchange(val);
        },
        /**
         * @param val
         */
        set onmouseover(val) {
          if (typeof val !== 'function') throw new Error('onmouseover event expecting a callback');
            that.sliderEvents.bindmouseover(val, true);
       },
        /**
         * @param val
         */
        set oninit(val) {
          if (typeof val !== 'function') throw new Error('onmouseover event expecting a callback');
          if (!that.isInitialized) {
            that.isInitialized = true;
            val(that.getValue());
          }
        }
      }
    };
	MrSlider.prototype.getSlider = function() {
		return this.slider;
	},
	MrSlider.prototype.appendSlider = function (parent) {
		return instance.appendSlider(parent, this.slider, () => {
			alert('hola');
			this.sliderEvents = new EventsSlider(this.slider, this.colorPalette);
			this.sliderEvents.bindthumbmove();
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