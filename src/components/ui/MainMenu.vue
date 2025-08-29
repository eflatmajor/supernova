<template>
  <CanvasScreen
    :load="load"
    :setup="setup"
    :update="update"
    :render="render"
    :input="input"
    :clearScreen="true"
    :fpsCounter="true"
    :renderSlottedContent="false"
  >
    <h1>Hello!</h1>
  </CanvasScreen>
</template>

<script>
import CanvasScreen from "components/CanvasScreen.vue";
import { randomInt } from "utilities/maths";
import * as sceneSolarSystem from "scenes/solar-system/scene";

const { load, setup, update, render, input } = sceneSolarSystem;

export default {
  components: { CanvasScreen },

  data() {
    return {
      logged: false,
      load,
      setup,
      update,
      render,
      input
    };
  }
};
</script>

<style scoped>
</style>
