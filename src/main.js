import { createApp } from "vue";
import { createPinia } from "pinia";
// import p5 from 'p5';

import App from './App.vue';

import './colours.css';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.mount('#app');

/*
function setupP5() {
  const application = new p5(instance => {
    const x = 100;
    const y = 100;
  
    instance.setup = function setup() {
      instance.createCanvas(500, 500);
      console.log(instance.width, instance.height);
    };
  
    instance.draw = function draw() {
      instance.background(0);
      instance.fill(205);
      instance.rect(x, y, 50, 50);
    };
  }, document.getElementById('canvas-container'));
}
*/
 