import { defineStore } from "pinia";

export const useGameStore = defineStore('game', {
  state() {
    return {
      colourScheme: "purple",
      currentRoom: 1
    };
  },
  getters: {},
  actions: {}
});
