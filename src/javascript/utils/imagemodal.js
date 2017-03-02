import Vue from 'vue';
import ImageModalVue from '../components/ImageModal';

const document = window.document;
const ImageModalConstructor = Vue.extend(ImageModalVue);
let instance;

export default {
  show(image) {
    if (!instance) {
      instance = new ImageModalConstructor({
        el: document.createElement('div'),
      });
      document.body.appendChild(instance.$el);
    }
    instance.show(image);
  },
};
