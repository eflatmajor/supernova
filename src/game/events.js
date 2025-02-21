class EventBus {
  listeners = new Map();

  $on(name, callback) {
    this.#register(name, callback);
  }

  $once(name, callback) {
    this.#register(name, callback, true);
  }

  $off(input) {
    const names = Array.isArray(input) ? input : [input];

    for (const name of names) {
      if ( ! this.listeners.has(name)) {
        continue;
      }

      const listeners = this.listeners.get(name);

      // if (listeners === undefined) {
      //   continue;
      // }

      this.listeners.delete(name);
    }
  }

  $emit(name, ...args) {
    if ( ! this.listeners.has(name)) {
      return false;
    }

    let listeners = this.listeners.get(name);
    let removeAfter = [];

    for (let [index, listener] of listeners.entries()) {
      listener.callback(...args);

      if (listener.once) {
        removeAfter.push(index);
      }
    }

    for (let i = removeAfter.length - 1; i >= 0; i--) {
      listeners.splice(removeAfter[i], 1);
    }
  }

  #register(name, callback, once = false) {
    if ( ! this.listeners.has(name)) {
      this.listeners.set(name, []);
    }

    let listeners = this.listeners.get(name);
    listeners.push({ callback, once });
  }
}

export default new EventBus();

export { EventBus };
