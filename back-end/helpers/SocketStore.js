module.exports = class SocketStore {
  static instance; // Type = SocketStore
  sockets = {};

  //meant to be private
  constructor() {}

  static getInstance() {
    if (!SocketStore.instance) {
      SocketStore.instance = new SocketStore();
    }
    return SocketStore.instance;
  }
};
