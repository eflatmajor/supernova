<template>
  <div class="overlay" :style="styles" :class="classes">
    <slot>
      <h1>I Am A Full-Screen Overlay</h1>
    </slot>
  </div>
</template>

<script>
export default {
  props: ["opacity", "center"],

  data() {
    return {
      _center: this.center ?? true,
      _opacity: this.opacity ?? 0.75
    };
  },

  computed: {
    styles() {
      return {
        opacity: this._opacity
      };
    },
    classes() {
      return {
        center: this._center
      }
    }
  },
}
</script>

<style>
div.overlay {
  font-family: monospace;
  /* Detect if we need to do the calc() (to avoid <Interface>'s input)! */
  height: calc(100vh - 32px);
  width: 100vw;
  padding: 1em;
  background-color: black;
  color: white;
  position: absolute;
}
div.overlay.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
