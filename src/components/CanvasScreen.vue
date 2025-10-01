<template>
  <Screen>
    <canvas id="screen-canvas" ref="canvas" :width="width" :height="height">
    </canvas>

    <div id="framerate" v-if="drawFrameRate">{{ fps }} FPS</div>

    <div id="screen-content" class="center" v-if="drawSlottedContent">
      <slot>
        <h1>Hi!</h1>
      </slot>
    </div>
  </Screen>
</template>

<script>
import { useMouse, useWindowSize, onKeyStroke } from "@vueuse/core";

import Screen from "components/Screen.vue";

export default {
  components: { Screen },

  props: [
    "load",
    "setup",
    "update",
    "update30TPS",
    "update15TPS",
    "render",
    "input",
    "clearScreen",
    "fpsCounter",
    "renderSlottedContent"
  ],

  setup() {
    const { x: mouseX, y: mouseY } = useMouse();
    const { width, height } = useWindowSize();

    return { width, height, mouseX, mouseY };
  },

  data() {
    return {
      id: -1,

      canvas: null,
      context: null,

      assets: {},

      keybindings: {},

      fnLoad: async () => true,
      fnSetup:  () => {},
      fnUpdate: () => {},
      fnUpdate30TPS: () => {},
      fnUpdate15TPS: () => {},
      fnRender: () => {},
      fnInput: () => {},

      loops: {
        "30TPS": {
          accumulator: 0,
          interval: 1000 / 30
        },
        "15TPS": {
          accumulator: 0,
          interval: 1000 / 15
        }
      },

      fps: 0.0,
      timestamp: 0,
      prevTimestamp: 0,
      deltaTime: 0,
      frameCount: 0,
      fpsUpdateRate: 30, // Update the FPS every *this many* frames.

      isPaused: false,
      logFrameRate: false, // Log FPS to console every `fpsUpdateRate` frames.
      drawFrameRate: this.fpsCounter, // Draw FPS overlay in top-left corner.
      doClear: this.clearScreen, // Automatically clear the canvas.
      drawSlottedContent: this.renderSlottedContent // Display any HTML passed to default slot?
    };
  },

  mounted() {
    //
    // Set up canvas, rendering context and hook up related callbacks
    //

    this.canvas = this.$refs?.canvas ?? null;
    this.context = this?.canvas?.getContext("2d") ?? null;

    window.canvas = this.canvas;
    window.context = this.context;

    if ( ! this.canvas || ! this.context) {
      console.error("<CanvasScreen /> - could not obtain reference to canvas context. Exiting early!");
      return;
    }

    if (typeof this.load === "function") {
      this.fnLoad = this.load.bind(this);
    }

    if (typeof this.setup === "function") {
      this.fnSetup = this.setup.bind(this);
    }

    if (typeof this.update === "function") {
      this.fnUpdate = this.update.bind(this);
    }

    if (typeof this.update30TPS === "function") {
      this.fnUpdate30TPS = this.update30TPS.bind(this);
    }

    if (typeof this.update15TPS === "function") {
      this.fnUpdate15TPS = this.update15TPS.bind(this);
    }

    if (typeof this.render === "function") {
      this.fnRender = this.render.bind(this);
    }

    if (typeof this.input === "function") {
      this.fnInput = this.input.bind(this);
    }

    //
    // Register keybindings
    //

    this.addKeybinding("KeyP", function() {
      console.log("pause keybinding pressed!", this);
    });

    //
    // Listen for keyboard events
    //

    onKeyStroke(true, (e) => {
      this.checkForKeybindings(e.code);
      this.fnInput(e);
    });

    //
    // Global debugging stuff.
    //
    window.pause = () => this.isPaused = ! this.isPaused;
    window.getCanvasScreen = () => this;

    //
    // Load assets, run setup, begin update/render loop.
    //

    let promise = this.fnLoad()
      .then(() => {
        this.fnSetup();
        this.doLoop(0);
      })
      .catch(console.error);
  },

  methods: {
    bindMethod(func) {
      const name = func.name || null;

      if ( ! name) {
        console.warn(`bindMethod() - Unnamed function passed!`, func);
        return;
      }

      if (this[name]) {
        console.warn(`bindMethod() - "${name}" is overriding an existing property!`);
      }

      this[name] = func.bind(this);
      console.info(`bindMethod() - Bound method "${name}".`);
    },

    bindMethods(functions) {
      if ( ! Array.isArray(functions)) {
        return console.warn("bindMethods() expected array containing functions!");
      }

      for (let func of functions) {
        this.bindMethod(func);
      }
    },

    async addAsset(name, path) {
      console.info(`Adding asset "${name}" with path "${path}".`);

      if (this.assets[name]) {
        return console.warn(`Attempted overwrite of asset with name - "${name}"!`);
      }

      const assetURL = new URL(path, import.meta.url).href;
      const asset = new Image();
      asset.src = assetURL;

      this.assets[name] = asset;

      return asset.decode();
    },

    async addAssets(assets) {
      if ( ! Array.isArray(assets)) {
        return console.warn("addAssets() expected array containing arrays of [name, path]!");
      }

      let promises = [];

      for (let asset of assets) {
        let [name, path] = asset;
        if ( ! name || ! path) {
          console.warn(`Skipping asset (${name}/${path}) due to empty name or path.`);
          continue;
        }

        promises.push(this.addAsset(name, path));
      }

      return Promise.allSettled(promises);
    },

    runSubLoops() {
      this.loops["30TPS"].accumulator += this.deltaTime;

      while (this.loops["30TPS"].accumulator >= this.loops["30TPS"].interval) {
        this.fnUpdate30TPS(this.timestamp, this.deltaTime);
        this.loops["30TPS"].accumulator -= this.loops["30TPS"].interval;
      }

      this.loops["15TPS"].accumulator += this.deltaTime;

      while (this.loops["15TPS"].accumulator >= this.loops["15TPS"].interval) {
        this.fnUpdate15TPS(this.timestamp, this.deltaTime);
        this.loops["15TPS"].accumulator -= this.loops["15TPS"].interval;
      }
    },

    doLoop(timestamp) {
      this.timestamp = timestamp;
      this.frameCount++;

      if( ! this.prevTimestamp) {
        this.prevTimestamp = this.timestamp;
      }

      this.deltaTime = this.timestamp - this.prevTimestamp;

      if (this.paused) {
        return;
      }

      if (this.doClear) {
        this.context.clearRect(0, 0, this.width, this.height);
      }

      this.runSubLoops();

      this.fnUpdate(this.timestamp, this.deltaTime);
      this.fnRender(this.timestamp, this.deltaTime);

      if (this.frameCount % this.fpsUpdateRate === 0) {
        this.fps = (1000 / this.deltaTime).toFixed(2);

        if (this.logFrameRate) {
          console.log(`${this.fps} FPS`);
        }
      }

      window.requestAnimationFrame((ts) => this.doLoop(ts));
      this.prevTimestamp = this.timestamp;
    },

    addKeybinding(code, callback) {
      if ( ! this.keybindings[code]) {
        this.keybindings[code] = [];
      }

      callback = callback.bind(this);

      this.keybindings[code].push(callback);
    },

    checkForKeybindings(code) {
      const bindings = this.keybindings?.[code] ?? [];

      for (let callback of bindings) {
        if (typeof callback === "function") {
          callback();
        }
      }
    }
  },

  computed: {
    centerX() {
      return this.width / 2;
    },

    centerY() {
      return this.height / 2;
    }
  }
};
</script>

<style scoped>
canvas#screen-canvas {
  height: 100vh;
  width: 100vw;
  background-color: #070a19;
  image-rendering: pixelated;
}

div#screen-content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
}

div#screen-content.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

div#framerate {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: black;
  color: white;
  opacity: 0.85;
  border-radius: 6px;
  padding: 1em;
}
</style>
