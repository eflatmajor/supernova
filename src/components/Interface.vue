<template>
  <div id="interface" :class="classes">
    <div id="command-output" ref="commandOutput">
      <Default-Command v-if=" ! hasCommandHistory" input="Information" output="No command history!" />

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

import DefaultCommand from "components/commands/Default.vue";

import { mapState } from "pinia";
import { useGameStore } from "stores/game.js";

let store; /* Must defer! */

// import { FLAGS } from "game/flags.js";
// import { STATISTICS } from "game/statistics.js";

import { commands as commandsMain } from "commands/main.js";
import { commands as commandsDevel } from "commands/developer.js";

const commands = [...commandsMain, ...commandsDevel];

import { getRoomById } from "game/rooms.js";

import "../assets/styles/interface.css";

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

    store.$subscribe((mutation, state) => {
      let { type, key, newValue } = mutation.events;

      if (type !== "set" || key !== "currentRoom") {
        return;
      }

      let room = getRoomById(newValue);

      this.output.push([
        `Current Room: ${room.name}`, room.description
      ]);
    });
  },

  mounted() {
    let room = getRoomById(store.currentRoom);

    // for (let i = 0; i < 30; i++) {
    //   this.output.push([
    //     "rand", Math.random()
    //   ]);
    // }

    this.output.push([
      `Current Room: ${room.name}`, room.description
    ]);

    this.$nextTick(() => {
      this.scroll();
    });
  },

  methods: {
    // TODO: Instead of having refs for every command entry we could just have
    //       an invisible like 1x1 div below the loop that renders the commands
    //       and scrollIntoView on THAT instead.
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

      // TODO: A little hacky. Would require moving some of our state into Pinia
      //       to do this properly.
      if (trigger === "clear") {
        this.output = [];
        return;
      }

      console.debug(`Processing command w/ trigger - ${trigger}`);
      console.debug("Arguments: ", args);

      let command = commands.find(cmd => cmd.trigger === trigger);

      if ( ! command) {
        command = commands.find(cmd => cmd?.aliases?.includes(trigger)) ?? false;
      }

      if ( ! command) {
        return console.warn(`Unknown command: ${trigger}`);
      }

      this.$emit('commandBefore', command.trigger, ...args);

      let result = command.run(...args);

      console.debug(`Command has ran w/ result - `, result);

      if (result !== false) {
        this.output.push([command.trigger, result]);
        this.$nextTick(() => this.scroll());
      }

      this.$emit('commandAfter', command.trigger, result);
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
