var clients = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("login", (id) => {
      console.log("sender ID: " + id);
      clients[id] = socket;
    });
    socket.on("msg", (msg) => {
      console.log(msg);
      let destination = msg.destination;
      if (clients[destination]) {
        clients[destination].emit("msg", msg);
      }
    });
  });
};