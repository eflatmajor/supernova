<template>
  <div :class="cssClass">
    <div class="command-input">
      {{ input }}
    </div>

    <div class="command-output">
      <div v-if="multipleOutputs">
        <ul>
          <li v-for="entry in output">
            <p>{{ entry }}</p>
          </li>
        </ul>
      </div>

      <div v-else>
        <p>{{ output }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { randomElement } from "../../utilities/array.js";

const COLOURS = [
  "purple",
  "red",
  "blue",
  "green",
  "yellow"
];

export default {
  props: ["input", "output", "colour"],

  data() {
    return {
      cssColour: ""
    };
  },

  mounted() {
    this.cssColour = this.colour ?? randomElement(COLOURS);
  },

  computed: {
    cssClass() {
      return ["command", this.cssColour];
    },

    multipleOutputs() {
      return Array.isArray(this.output);
    }
  }
};
</script>

<style>
div.command {
  font-family: monospace;
  font-size: 14px;
  color: white;
  display: flex;
  border-radius: 4px;
  margin: 1em 0;
}

.purple {
  div.command-input {
    background-color: var(--purple-1);  
  }
  div.command-output {
    background-color: var(--purple-2);
  }
}

.red {
  div.command-input {
    background-color: var(--red-1);  
  }
  div.command-output {
    background-color: var(--red-2);
  }
}

.blue {
  div.command-input {
    background-color: var(--blue-1);  
  }
  div.command-output {
    background-color: var(--blue-2);
  }
}

.green {
  div.command-input {
    background-color: var(--green-1);  
  }
  div.command-output {
    background-color: var(--green-2);
  }
}

.yellow {
  div.command-input {
    background-color: var(--yellow-1);  
  }
  div.command-output {
    background-color: var(--yellow-2);
  }
}

div.command-input {
  padding: 1em;
  font-weight: bold;
  border-radius: 4px 0 0 4px;
  border-right: 2px solid black;
}

div.command-output {
  padding: 1em;
  border-radius: 0 4px 4px 0;
  flex-grow: 1;
}

div.command-output ul {
  margin-left: 1em;
  /* display: flex; */
  /* flex-wrap: wrap; */
}

div.command-output li {
  /* width: 25%; */
  /* margin-bottom: 0.5em; */
}
</style>
