module.exports = class Sockets {
  static instance; // Type = helperSockets
  sockets = {};

  //meant to be private
  constructor() {}

  static getInstance() {
    if (!Sockets.instance) {
      Sockets.instance = new Sockets();
    }
    return Sockets.instance;
  }
};
