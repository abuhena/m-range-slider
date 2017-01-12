/**
 * Created by Shariar Shaikot on 1/9/17.
 */

import createElement from './create.slider';
import EventsSlider from './events.slider';

window.onload = function () {
  (function (instance, window) {
    window.MrSlider = function (id) {
      this.slider = instance.findElement.getSliderById(id);
      if (!this.slider) throw new Error(`Unable to find any slider corresponding #${id}`);
      /**
       * @type {EventsSlider}
       */
      this.sliderEvents = new EventsSlider(this.slider);
      this.sliderEvents.bindthumbmove();
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
     * @returns {*}
     */
    MrSlider.prototype.valueOf = function () {
      return this.slider;
    }

  })(createElement.instance, window);
};