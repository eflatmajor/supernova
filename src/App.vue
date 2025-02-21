<template>
  <InfoBar v-if="showInfoBar" />

  <Overlay v-if="showOverlay">
    <h1>Hello World!</h1>
  </Overlay>

  <Interface
    @command-before="cmdBefore"
    @command-after="cmdAfter"
  />
</template>

<script>
import Interface from "components/Interface.vue";
import InfoBar from "./components/InfoBar.vue";
import Overlay from "components/Overlay.vue";

/*
  Mapping of commands to Vue data, for commands which have their own UI component.
*/
const COMMAND_INTERFACES = {
  infobar: "showInfoBar",
  overlay: "showOverlay"
};

export default {
  components: { Interface, InfoBar, Overlay },

  data() {
    return {
      showInfoBar: false,
      showOverlay: false
    };
  },

  methods: {
    cmdBefore(cmd, ...args) {
      console.log(`cmdBefore:${cmd}`);
      console.log(args, );
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

<style scoped>

</style>
