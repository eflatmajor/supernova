<template>
  <InfoBar v-if="testShowInfoBar" />

  <Overlay v-if="testShowOverlay">
    <!-- <h1>Hello Overlay Test World!</h1> -->
  </Overlay>

  <Overlay v-if="testShowTitleScreen" :opacity="1.0">
    <TitleScreen />
  </Overlay>

  <MainMenu v-if="testShowMainMenu">
  </MainMenu>

  <Interface
    v-if="false"
    @command-before="cmdBefore"
    @command-after="cmdAfter"
  />
</template>

<script>
// #region todo
//
// TODO:
//
// Come up with some kind of system that can handle multiple different
// UI "screens" (such as: title screen, main menu, settings, main game UI etc.)
// and also overlays/modals (such as: inventory screen, character sheet etc.)
//
// The current idea is that "Screens" are full-screen and it's intended that only
// one will be active at any time, whereas modals can show above (any) screen(s).
//
// Perhaps for UI screens we can have some kind of (finite?) state machine where
// only one screen can be active at a time, or a stack where the screen at the
// top of the stack is the one that is rendered, this would allow for e.g. pushing
// a settings screen onto the stack above the main game UI screen.
//
// How to handle e.g. moving from the main game interface to other UI screens,
// without losing the game state - is <KeepAlive> relevant here?
//
// Can/should we use Vue Router or will that unnecessarily complicate things?
//
// Modals/Overlays need to know if the main game UI (<Interface>) is currently
// being rendered behind them, to make the backdrop not render over the main
// text input from the Interface.
//
// #endregion

import { onKeyStroke } from '@vueuse/core'

import Interface from "components/Interface.vue";
import InfoBar from "components/InfoBar.vue";
import Overlay from "components/Overlay.vue";
import Screen from "components/Screen.vue";
import CanvasScreen from "components/CanvasScreen.vue";
import TitleScreen from "components/ui/TitleScreen.vue";
import MainMenu from "components/ui/MainMenu.vue";

/*
  Mapping of command names <-> Vue data property key, for commands which
  are paired with their own UI component (with toggleable visibility).
*/
const COMMAND_INTERFACES = {
  infobar: "testShowInfoBar",
  overlay: "testShowOverlay",
  // NOTE: No titleScreen/mainMenu because its a "Screen", not a "Modal"/"Overlay".
};

export default {
  components: { Interface, InfoBar, Overlay, TitleScreen, MainMenu, Screen, CanvasScreen },

  setup() {
    onKeyStroke(['`'], (e) => {
      e.preventDefault()
      //
      // TODO: Implement Developer UI/Debug Console
      //
    });
  },

  data() {
    return {
      testShowInfoBar: false,
      testShowOverlay: false,
      testShowTitleScreen: false,
      testShowMainMenu: true
    };
  },

  methods: {
    cmdBefore(cmd, ...args) {
      console.log(`cmdBefore:${cmd}`);
      console.log(args);
    },

    cmdAfter(cmd, results) {
      console.log(`cmdAfter:${cmd}`);
      console.log(`Results - `, results);

      let cmdInterface = COMMAND_INTERFACES[cmd] ?? false;

      if (cmdInterface) {
        this[cmdInterface] = ! this[cmdInterface];
      }
    },
  }
};
</script>

<style>
div#app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>