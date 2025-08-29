<template>
  <div id="title-screen-logo">
     <canvas id="logo-canvas"></canvas>
  </div>
</template>

<script>
/*
  https://youtu.be/2F2t1RJoGt8?t=3588
*/

import { useMouse } from "@vueuse/core";
import { useGameStore } from "stores/game.js";
import { randomInt, randomFloat, randomRGB, remapRange, wrap } from "utilities/maths";

class Particle {
  constructor(vue, x, y, colour) {
    this.vue = vue;
    this.ctx = vue.context;

    this.x = x; // Math.random() * this.vue.width;
    this.y = y; // Math.random() * this.vue.height;

    // this.colour = "blue"; // colour;
    this.hue = 180;
    this.saturation = 50;
    this.lightness = 75;
    this.jitter = randomFloat(-10, 10);

    this.size = vue.pixelSpacing;
    this.originX = x;
    this.originY = y;

    this.dX = this.dY = 0; // Delta between particle and mouse cursor
    this.vX = this.vY = 0; // Velocity

    this.force = 0;
    this.angle = 0;

    this.friction = randomFloat(0.15, 0.75);
    this.ease = Math.random() * 0.1 + 0.005; //randomFloat(0.005, 0.105);
  }

  get distance() {
    let x1 = this.x, x2 = this.vue.mouseX;
    let y1 = this.y, y2 = this.vue.mouseY;

    let a = x1 - x2;
    let b = y1 - y2;

    return Math.sqrt(a * a + b * b);
  }

  get colour() {
    return `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
  }

  update() {
    /*
    this.x += randomFloat(0.2, 0.4);
    this.y += randomFloat(0.2, 0.4);

    this.x += (this.originX - this.x) * this.ease;
    this.y += (this.originY - this.y) * this.ease;
    */

    /*
    let hue = remapRange(this.x, 0, this.vue.width, 0, 360);
    let sat = remapRange(this.y, 0, this.vue.height, 25, 75);
    let jitter = randomInt(10, 20);
    let jitterSign = Math.random() > 0.5;
    hue += jitterSign ? jitter : -jitter;
    this.colour = `hsl(${hue}, ${sat}%, 50%)`;
    */

    const hueMin = this.vue.hueMin;
    const hueMax = this.vue.hueMax;
    this.hue = remapRange(this.x, 0, this.vue.width, hueMin, hueMax);
    this.saturation = remapRange(this.y, 0, this.vue.height, 0, 100);
    // console.log(this.saturation);
    // console.log(this.x, hueMin, hueMax);
    // console.log(this.hue);
  }

  render() {
    // const colour = randomRGB(false, 55, 200);
    // console.log(colour);

    // this.ctx.strokeStyle = "green";
    // this.ctx.fillStyle = this.colour;
    // this.ctx.fillRect(this.originX, this.originY, this.size, this.size);
    this.ctx.beginPath();
    this.ctx.rect(this.x, this.y, this.size, this.size);

    // this.ctx.lineWidth = 2;
    // this.ctx.strokeStyle = "black";
    // this.ctx.stroke();

    this.ctx.fillStyle = this.colour;
    this.ctx.fill();
    this.ctx.closePath();
  }
}

export default {
  beforeCreate() {
    this.store = useGameStore();
  },

  setup() {
    const { x: mouseX, y: mouseY } = useMouse();

    return { mouseX, mouseY };
  },

  mounted() {
    const canvas = document.getElementById("logo-canvas");
    const context = canvas.getContext("2d");

    this.context = context;
    this.width = canvas.width;
    this.height = canvas.height;

    this.initialise();

    requestAnimationFrame(this.render.bind(this));
  },

  data() {
    const hueTarget = 0;
    const hueDelta = 1; // 0.1;
    const hueSpacing = 42;

    return {
      text: "SUPERNOVA",
      pixelSpacing: 3,
      fontSize: 48, // px
      particles: [],
      hueSpacing,
      hueTarget,
      hueDelta
    };
  },

  computed: {
    hueMin() {
      let value = this.hueTarget - this.hueSpacing;
      return (value < 0) ? value + 360 : value;
    },

    hueMax() {
      let value = this.hueTarget + this.hueSpacing;
      return (value > 360) ? value - 360 : value
    }
  },

  methods: {
    updateHue() {
      this.hueTarget += this.hueDelta;
      // console.log("hueTarget", this.hueTarget);
      if (this.hueTarget > 360) {
        this.hueTarget -= 360;
      }
      else if (this.hueTarget < 0) {
        this.hueTarget += 360;
      }
    },

    render(doLoop = true) {
      // this.context.clearRect(0, 0, this.width, this.height);
      // this.context.fillStyle = "red";
      // this.context.fillText(this.text, this.width / 2, this.height / 2);

      this.updateHue();
      // this.renderInitialText();
      this.renderParticles();
      // console.log(this.hueTarget, this.hueMin, this.hueMax);

      if (doLoop) {
        requestAnimationFrame(() => this.render());
      }
    },

    renderInitialText() {
      this.context.clearRect(0, 0, this.width, this.height);
      this.context.fillStyle = "red";
      this.context.fillText(this.text, this.width / 2, this.height / 2);

    },

    renderParticles() {
      // this.context.clearRect(0, 0, this.width, this.height);

      for (let i = 0; i < this.particles.length; i++) {
        const first = i === 0;
        const particle = this.particles[i];
        // console.log(particle.x === 0, particle.y === 0);
        if (first) {
          // console.log("before update", particle);
          // console.log((particle.originX - particle.x));
          // console.log((particle.originY - particle.y));
        }
        particle.update();
        if (first) {
          // console.log("after update", particle.x, particle.y);
        }
        particle.render();
      }
    },

    initialiseTypography() {
      this.context.textAlign = "center";
      this.context.textBaseline = "middle";
      this.context.lineWidth = 3;
      this.context.strokeStyle = "white";
      this.context.font = `${this.fontSize}px Helvetica`;
    },

    initialiseParticles() {
      const { data: pixels } = this.context.getImageData(0, 0, this.width, this.height);
      console.log("initialisePixels", pixels);

      this.context.clearRect(0, 0, this.width, this.height);

      for (let y = 0; y < this.height; y += this.pixelSpacing) {
        for (let x = 0; x < this.width; x += this.pixelSpacing) {
          const index = (y * this.width + x) * 4; // Add in-bounds check...?
          const alpha = pixels[index + 3];

          if (alpha > 0) {
            const r = pixels[index + 0];
            const g = pixels[index + 1];
            const b = pixels[index + 2];

            const colour = `rgb(${r}, ${g}, ${b})`;

            this.particles.push(new Particle(this, x, y, colour));
          }
        }
      }

      console.log(`Generated ${this.particles.length} particles.`);
    },

    initialise() {
      this.initialiseTypography();
      // this.render(false); // Initial one-time render.
      this.renderInitialText();
      this.initialiseParticles();
    }
  }
}
</script>

<style scoped>
div#title-screen-logo {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 0 auto;
}

canvas#logo-canvas {
  height: 360px;
  width: 640px;
  border: 2px dashed black;
  /* background-color: black; */
}
</style>
