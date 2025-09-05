<template>
  <div id="info_bar">
    <nav>
      <ul>
        <slot>
          <li>❤️ <sub>x</sub><span title="Current Hitpoints">{{ health }}</span></li>
          <li>🛡️ <sub>x</sub><span title="Shield Capacity">{{ shields }}</span></li>
          <li>💰 <sub>x</sub><span title="Credits Owned">{{ money }}</span></li>
      </slot>
      </ul>
    </nav>
  </div>
</template>

<script>
// TODO: Fetch player data from the state store.

export default {
  data() {
    return {
      health: 10,
      shields: 42,
      money: 69
    };
  }
};
</script>

<style scoped>
div#info_bar {
  position: fixed;
  width: 100%;
  z-index: 420;
  color: white;
}

ul {
  padding: 0.25rem 0;
  height: 100%;
  display: flex;
  justify-content:space-around;
  align-items: center;
  list-style-type: none;
  /* background-color: var(--purple-4); */
  background-color: black;
  opacity: 0.7;
}
</style>
