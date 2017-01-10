/**
 * Created by Shariar Shaikot on 1/9/17.
 */

import createElement from './create.slider';
import EventsSlider from './events.slider';

window.onload = function () {
  (function (instance, window) {
    window.MrSlider = function (id) {
      MrSlider.slider = instance.findElement.getSliderById(id);
      console.dir(MrSlider.slider);
      if (!MrSlider.slider) throw new Error(`Unable to find any slider corresponding #${id}`);
      MrSlider.events = new EventsSlider(MrSlider.slider);
      Object.defineProperty(MrSlider.events, 'onmouseover', {
        set: function (val) {
          if (typeof val !== 'function') throw new Error('onmouseover event expecting a callback');
          MrSlider.events.bindmouseover(val, true);
        }
      });
      return MrSlider;
    };
  })(createElement.instance, window);
};