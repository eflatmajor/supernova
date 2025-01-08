<template>
  <div id="interface" :class="classes">
    <div id="command-output" ref="commandOutput">
      <Default-Command v-if=" ! hasCommandHistory" input="INFO" output="No command history!" />

      <div v-for="[input, output] in output" ref="cmdEntry">
        <Default-Command :input="input" :output="output" />
      </div>
    </div>

    <div id="command-input">
      <input type="text" v-model="inputText" @keyup.enter="processCommand" @keyup.up="goBack" @keyup.down="goForward" placeholder="Enter Command" />
    </div>
  </div>
</template>

<script>
// TODO: Commands need to return an array of [status, output] - the status will
//       be used so that for example if the player does `go north` and that move
//       is not possible, then a status of `FAILURE` will be passed into the command
//       component, so that it can then render a red box instead of the default.

// TODO: When using the arrow (up/down) keys to navigate through the command
//       history, the cursor moves around - try to find a way to always keep
//       the cursor at the start OR the end.

import DefaultCommand from "commands/Default.vue";

import { randomElement } from "utilities/array.js";
import { COLOURS } from "utilities/colours";

import "../interface.css";

import { mapState } from "pinia";
import { useGameStore } from "stores/game.js";

let store; /* Must defer! */

import { setStore } from "@/game/store.js";
import { globalFlags } from "@/game/flags.js";
import { statistics } from "@/game/statistics.js";
import { commands } from "@/game/commands.js";

export default {
  components: {
    DefaultCommand
  },

  data() {
    return {
      inputText: "",
      history: [],
      output: [],
      historyCurrent: -1
    }
  },

  beforeCreate() {
    store = useGameStore();
    setStore(store);
  },

  mounted() {
    for (let i = 0; i < 30; i++) {
      this.output.push([
        "rand", Math.random()
      ]);
    }

    this.$nextTick(() => {
      this.scroll();
    });
  },

  methods: {
    scroll() {
      let index = this.$refs.cmdEntry?.length - 1;
      let latestEntry = this.$refs.cmdEntry?.[index];

      if (latestEntry) {
        latestEntry.scrollIntoView();
      }
    },

    /*
      Navigate backwards through the input history.
    */

    goBack() {
      this.historyCurrent--;

      if (this.historyCurrent < 0) {
        this.historyCurrent = 0;
      }

      this.inputText = this.history[this.historyCurrent];
    },

    /*
      Navigate forwards through the input history.
    */

    goForward() {
      this.historyCurrent++;

      if (this.historyCurrent > this.history.length - 1) {
        this.historyCurrent = this.history.length - 1;
      }

      this.inputText = this.history[this.historyCurrent];
    },

    saveToHistory() {
      this.history.push(this.inputText);
      this.historyCurrent = this.history.length;
    },

    processCommand() {
      this.saveToHistory();
      let input = this.inputText.trim().split(" ");

      this.inputText = "";

      let [trigger, ...args] = input;

      // console.info("Processing command.");
      // console.info("Trigger: ", trigger);
      // console.info("Arguments: ", args);

      let command = commands.find(cmd => cmd.trigger === trigger);

      if ( ! command) {
        command = commands.find(cmd => cmd.aliases.includes(trigger));
      }

      if ( ! command) {
        return console.warn(`Unknown command: ${trigger}`);
      }

      let result = command.run(...args);

      // this.output.push([input.join(" "), result]);
      this.output.push([trigger, result]);

      this.$nextTick(() => {
        this.scroll();
      });
    }
  },

  computed: {
    ...mapState(useGameStore, ["colourScheme"]),

    hasCommandHistory() {
      return this.output.length > 0;
    },

    classes() {
      return [this.colourScheme];
    }
  }
};
</script>

<style scoped>
div#interface {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

div#command-output {
  flex: 1;
  /* background-color: var(--purple-3); */
  height: calc(100vh - 32px);
  padding: 1em 1em 0 1em;
  overflow-y: scroll;
}

input {
  font-family: monospace;
  width: 100vw;
  padding: 4px 8px;
  margin: 0;
  border: 0;
  border-top: 2px solid black;
  height: 32px;
  line-height: 32px;
  /* background-color: var(--purple-1); */
  color: white;
  font-size: 14px;
}

.purple {
  div#command-output {
    background-color: var(--purple-3);
  }

  input {
    background-color: var(--purple-1);
  }
}

.red {
  div#command-output {
    background-color: var(--red-3);
  }

  input {
    background-color: var(--red-1);
  }
}

.blue {
  div#command-output {
    background-color: var(--blue-3);
  }

  input {
    background-color: var(--blue-1);
  }
}

.green {
  div#command-output {
    background-color: var(--green-3);
  }

  input {
    background-color: var(--green-1);
  }
}

.yellow {
  div#command-output {
    background-color: var(--yellow-3);
  }

  input {
    background-color: var(--yellow-1);
  }
}
</style>
