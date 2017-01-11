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
      // var that = this;
      // Object.defineProperty(this.events, 'onmouseover', {
      //   set: function (val) {
      //     if (typeof val !== 'function') throw new Error('onmouseover event expecting a callback');
      //     that.events.bindmouseover(val, true);
      //   }
      // });
      // Object.defineProperty(this.events, 'onchange', {
      //   set: function (val) {
      //     if (typeof val !== 'function') throw new Error('onmouseover event expecting a callback');
      //     that.events.bindchange(val);
      //   }
      // });
    };
    MrSlider.prototype.events = function() {
      var that = this;
      return {
        set onchange(val) {
          if (typeof val !== 'function') throw new Error('onmouseover event expecting a callback');
            that.sliderEvents.bindchange(val);
        },
        set onmouseover(val) {
          if (typeof val !== 'function') throw new Error('onmouseover event expecting a callback');
            that.sliderEvents.bindmouseover(val, true);
       }
      }
    }
    /**
     * @returns {number|*}
     */
    MrSlider.prototype.getValue = function () {
      return instance.findElement.getSliderByContext(this.slider).fill;
    };
    /**
     * @param num
     */
    MrSlider.prototype.setValue = function (num) {
      instance.findElement.getSliderByContext(this.slider).fill = Number(num);
    };
    /**
     * @returns {*}
     */
    MrSlider.prototype.valueOf = function () {
      return this.slider;
    }

  })(createElement.instance, window);
};