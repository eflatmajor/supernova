let store;

/*
  Must be called at some point with the store instance returned from `useGameStore()`.

  Currently this is called from `beforeCreate` in `src/components/Interface.vue`.

  See: https://pinia.vuejs.org/core-concepts/outside-component-usage.html
*/
export function setStore(store_) {
  console.debug("Store has been registered with @/game/store.js.");
  store = store_;
}

/*
  Provides access to the store, so long as it's called after `setStore()`.
*/
export function getStore() {
  return store;
}
