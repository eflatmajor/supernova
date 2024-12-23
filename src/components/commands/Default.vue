<template>
  <div class="command">
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
export default {
  props: ["input", "output", "colour"],

  data() {
    return {

    };
  },

  computed: {
    multipleOutputs() {
      return Array.isArray(this.output);
    }
  }
};
</script>

<style>
div.command {
  font-family: monospace;
  background-color: green;
  font-size: 14px;
  color: white;
  display: flex;
  border: 2px solid black;
  border-radius: 4px;
  margin: 1em 0;
}

div.command-input {
  background-color: red;
  padding: 1em;
  font-weight: bold;
  border-radius: 4px 0 0 4px;
  border-right: 4px solid black;
}

div.command-output {
  background-color: blue;
  padding: 1em;
  border-radius: 0 4px 4px 0;
  flex-grow: 1;
}

div.command-output ul {
  margin-left: 1em;
  display: flex;
  flex-wrap: wrap;
}

div.command-output li {
  width: 25%;
  margin-bottom: 0.5em;
}
</style>
